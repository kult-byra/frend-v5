"use client";

import { Box, Card, Flex, Grid, Stack, Text } from "@sanity/ui";
import type { LucideIcon } from "lucide-react";
import { useCallback } from "react";
import type { StringInputProps } from "sanity";
import { set, unset } from "sanity";

export type GridOption = {
  value: string;
  title: string;
  description?: string;
  icon: LucideIcon;
};

export type GridOptionsInputProps = {
  options: GridOption[];
  columns?: number;
};

export const GridOptionsInput = (props: StringInputProps & GridOptionsInputProps) => {
  const { value = "", onChange, options, columns = 2 } = props;

  const handleChange = useCallback(
    (newValue: string) => onChange(!newValue || newValue === value ? unset() : set(newValue)),
    [onChange, value],
  );

  return (
    <Grid columns={[1, columns]} gap={3}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;

        return (
          <Card
            key={option.value}
            as="button"
            type="button"
            onClick={() => handleChange(option.value)}
            padding={4}
            radius={2}
            shadow={isSelected ? 2 : 1}
            tone={isSelected ? "primary" : "default"}
            style={{
              cursor: "pointer",
              backgroundColor: "var(--card-bg-color)",
              border: isSelected
                ? "2px solid var(--card-focus-ring-color)"
                : "1px solid var(--card-border-color)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor =
                  "var(--card-hover-border-color, var(--card-border-color))";
                e.currentTarget.style.backgroundColor = "var(--card-bg-secondary-color)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "var(--card-border-color)";
                e.currentTarget.style.backgroundColor = "var(--card-bg-color)";
              }
            }}
          >
            <Stack space={3}>
              <Flex align="center" gap={3}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.5rem",
                    backgroundColor: isSelected
                      ? "var(--card-focus-ring-color)"
                      : "var(--card-bg-secondary-color)",
                    color: isSelected
                      ? "var(--card-focus-ring-text-color)"
                      : "var(--card-muted-fg-color)",
                  }}
                >
                  <Icon size={20} />
                </Box>
                <Text size={2} weight="semibold">
                  {option.title}
                </Text>
              </Flex>
              {option.description && (
                <Text size={1} muted>
                  {option.description}
                </Text>
              )}
            </Stack>
          </Card>
        );
      })}
    </Grid>
  );
};
