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

export const IllustrationInput = (props: StringInputProps & IllustrationInputProps) => {
  const { value = "", onChange, filterMode, filterType } = props;

  const [filter, setFilter] = useState<FilterState>({
    mode: filterMode ?? "all",
    type: filterType ?? "all",
  });

  const handleChange = useCallback(
    (newValue: IllustrationName) => {
      onChange(!newValue || newValue === value ? unset() : set(newValue));
    },
    [onChange, value],
  );

  // Group illustrations by mode and type
  const groupedIllustrations = useMemo(() => {
    const filtered = ILLUSTRATIONS.filter((illustration) => {
      if (filter.mode !== "all" && illustration.mode !== filter.mode) return false;
      if (filter.type !== "all" && illustration.type !== filter.type) return false;
      return true;
    });

    // Group by mode first, then by type
    const groups: Record<
      string,
      { mode: IllustrationMode; type: IllustrationType; items: typeof filtered }
    > = {};

    for (const item of filtered) {
      const key = `${item.mode}-${item.type}`;
      if (!groups[key]) {
        groups[key] = { mode: item.mode, type: item.type, items: [] };
      }
      groups[key].items.push(item);
    }

    // Sort: dark illustrations, dark icons, light illustrations, light icons
    const order = ["dark-illustration", "dark-icon", "light-illustration", "light-icon"];
    return order.map((key) => groups[key]).filter(Boolean);
  }, [filter]);

  return (
    <Flex direction="column" gap={4}>
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
                <option value="dark">For dark backgrounds</option>
                <option value="light">For light backgrounds</option>
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
              </select>
            </Card>
          </Stack>
        </Flex>
      )}

      {/* Grouped sections */}
      <Stack space={5}>
        {groupedIllustrations.map((group) => (
          <Stack key={`${group.mode}-${group.type}`} space={3}>
            {/* Section header */}
            <Flex align="center" gap={2}>
              <Text size={1} weight="semibold">
                {group.type === "illustration" ? "Illustrations" : "Icons"}
              </Text>
              <Text size={1} muted>
                — {MODE_LABELS[group.mode]}
              </Text>
            </Flex>

            {/* Grid of items */}
            <Grid columns={[3, 4, 5, 6]} gap={2}>
              {group.items.map((illustration) => {
                const isSelected = value === illustration.name;
                const svgUrl = `${env.SANITY_STUDIO_FRONTEND_URL}/illustrations/${illustration.name}.svg`;
                // Show on matching background to preview how SVG will look in use
                const bgColor = group.mode === "dark" ? "#1a1a2e" : "#ffffff";

                return (
                  <Tooltip
                    key={illustration.name}
                    content={
                      <Box padding={2}>
                        <Text size={1} weight="semibold">
                          {illustration.label}
                        </Text>
                        <Text size={0} muted>
                          {MODE_LABELS[illustration.mode]}
                        </Text>
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
          </Stack>
        ))}
      </Stack>

      {/* Selected value display */}
      {value && (
        <Card padding={3} radius={2} tone="primary">
          <Flex align="center" gap={3}>
            <img
              src={`${env.SANITY_STUDIO_FRONTEND_URL}/illustrations/${value}.svg`}
              alt="Selected"
              style={{ width: 48, height: 48, objectFit: "contain" }}
            />
            <Stack space={2} style={{ flex: 1 }}>
              <Text size={1} weight="semibold">
                {ILLUSTRATIONS.find((i) => i.name === value)?.label ?? value}
              </Text>
              <Text size={0} muted>
                {MODE_LABELS[ILLUSTRATIONS.find((i) => i.name === value)?.mode ?? "dark"]}
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
    </Flex>
  );
};
