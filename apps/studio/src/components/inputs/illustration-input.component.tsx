import { Box, Button, Card, Flex, Grid, Stack, Text, Tooltip } from "@sanity/ui";
import { useCallback, useMemo, useState } from "react";
import type { StringInputProps } from "sanity";
import { set, unset } from "sanity";
import { env } from "@/env";
import {
  ILLUSTRATIONS,
  type IllustrationMode,
  type IllustrationName,
  type IllustrationType,
  MODE_LABELS,
} from "@/utils/illustrations.const";

export type IllustrationInputProps = {
  filterMode?: IllustrationMode;
  filterType?: IllustrationType;
};

type FilterState = {
  mode: IllustrationMode | "all";
  type: IllustrationType | "all";
};

const INITIAL_VISIBLE_COUNT = 12;

/** Background colors for previewing illustrations in their intended context */
const MODE_BG_COLORS: Record<IllustrationMode, string> = {
  light: "#ffffff", // --color-white
  dark: "#0b0426", // --color-dark-purple
};

export const IllustrationInput = (props: StringInputProps & IllustrationInputProps) => {
  const { value = "", onChange, filterMode, filterType } = props;

  const [filter, setFilter] = useState<FilterState>({
    mode: filterMode ?? "all",
    type: filterType ?? "all",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = useCallback(
    (newValue: IllustrationName) => {
      onChange(!newValue || newValue === value ? unset() : set(newValue));
    },
    [onChange, value],
  );

  // Filter illustrations into a flat list
  const filteredIllustrations = useMemo(() => {
    return ILLUSTRATIONS.filter((illustration) => {
      if (filter.mode !== "all" && illustration.mode !== filter.mode) return false;
      if (filter.type !== "all" && illustration.type !== filter.type) return false;
      return true;
    });
  }, [filter]);

  const selectedIllustration = ILLUSTRATIONS.find((i) => i.name === value);

  const visibleItems = isExpanded
    ? filteredIllustrations
    : filteredIllustrations.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = filteredIllustrations.length > INITIAL_VISIBLE_COUNT;
  const hiddenCount = filteredIllustrations.length - INITIAL_VISIBLE_COUNT;

  return (
    <Flex direction="column" gap={4}>
      {/* Selected value display at top for quick reference */}
      {value && selectedIllustration && (
        <Card padding={3} radius={2} tone="primary">
          <Flex align="center" gap={3}>
            <Box
              style={{
                width: 48,
                height: 48,
                borderRadius: 4,
                background: MODE_BG_COLORS[selectedIllustration.mode],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`${env.SANITY_STUDIO_FRONTEND_URL}/illustrations/${value}.svg`}
                alt="Selected"
                style={{ width: 40, height: 40, objectFit: "contain" }}
              />
            </Box>
            <Stack space={1} style={{ flex: 1 }}>
              <Text size={1} weight="semibold">
                {selectedIllustration.label}
              </Text>
              <Text size={0} muted>
                {MODE_LABELS[selectedIllustration.mode]}
              </Text>
            </Stack>
            <Button
              text="Clear"
              tone="critical"
              mode="ghost"
              fontSize={1}
              padding={2}
              onClick={() => onChange(unset())}
            />
          </Flex>
        </Card>
      )}

      {/* Filter dropdowns */}
      {!filterMode && !filterType && (
        <Flex gap={3} wrap="wrap">
          <Stack space={2} style={{ minWidth: 160 }}>
            <Text size={1} muted>
              Background
            </Text>
            <Card padding={2} radius={2} border>
              <select
                value={filter.mode}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    mode: e.target.value as FilterState["mode"],
                  }))
                }
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="all">All backgrounds</option>
                <option value="light">For light backgrounds</option>
                <option value="dark">For dark backgrounds</option>
              </select>
            </Card>
          </Stack>
          <Stack space={2} style={{ minWidth: 160 }}>
            <Text size={1} muted>
              Type
            </Text>
            <Card padding={2} radius={2} border>
              <select
                value={filter.type}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    type: e.target.value as FilterState["type"],
                  }))
                }
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="all">All types</option>
                <option value="illustration">Illustrations</option>
                <option value="icon">Icons</option>
                <option value="area-icon">Area Icons</option>
              </select>
            </Card>
          </Stack>
        </Flex>
      )}

      {/* Single flat grid of all illustrations */}
      <Stack space={3}>
        <Grid columns={[3, 4, 5, 6]} gap={2}>
          {visibleItems.map((illustration) => {
            const isSelected = value === illustration.name;
            const svgUrl = `${env.SANITY_STUDIO_FRONTEND_URL}/illustrations/${illustration.name}.svg`;
            const bgColor = MODE_BG_COLORS[illustration.mode];

            return (
              <Tooltip
                key={illustration.name}
                content={
                  <Box padding={2}>
                    <Text size={1}>{illustration.label}</Text>
                  </Box>
                }
                placement="top"
              >
                <Card
                  as="button"
                  type="button"
                  padding={2}
                  radius={2}
                  tone={isSelected ? "primary" : "default"}
                  style={{
                    cursor: "pointer",
                    border: isSelected
                      ? "2px solid var(--card-focus-ring-color)"
                      : "1px solid var(--card-border-color)",
                    background: bgColor,
                  }}
                  onClick={() => handleChange(illustration.name as IllustrationName)}
                >
                  <Flex align="center" justify="center" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={svgUrl}
                      alt={illustration.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "80px",
                        maxHeight: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Flex>
                </Card>
              </Tooltip>
            );
          })}
        </Grid>

        {/* Show more / Show less button */}
        {hasMore && (
          <Button
            text={isExpanded ? "Show less" : `Show ${hiddenCount} more`}
            mode="ghost"
            tone="default"
            fontSize={1}
            padding={2}
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ alignSelf: "flex-start" }}
          />
        )}
      </Stack>
    </Flex>
  );
};
