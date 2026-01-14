import { COLORS, type ColorName } from "@/utils/colors.const";
import { Box, Inline } from "@sanity/ui";

import { useCallback } from "react";
import type { StringInputProps } from "sanity";
import { set, unset } from "sanity";

export type ColorInputProps = {
  colors: ColorName[];
};

export const ColorInput = (props: StringInputProps & ColorInputProps) => {
  const { value = "", onChange, colors } = props;

  const handleChange = useCallback(
    (newValue: ColorName) => onChange(!newValue || newValue === value ? unset() : set(newValue)),
    [onChange, value],
  );

  const selectableColors = COLORS.filter((color) => colors.includes(color.name));

  return (
    <Inline space={2}>
      {selectableColors.map((color) => {
        const isChecked = value === color.name;

        return (
          <Box
            as="button"
            key={color.name}
            flex={1}
            display="flex"
            onClick={() => {
              handleChange(color.name);
            }}
            style={{
              border: `1px solid ${
                isChecked ? "var(--card-focus-ring-color)" : "var(--card-border-color)"
              } `,
              outline: isChecked ? "1px solid var(--card-focus-ring-color)" : "none",
              borderRadius: "100%",
              padding: "0.2rem",
              cursor: "pointer",
              backgroundColor: "var(--card-bg-color)",
            }}
          >
            <div
              style={{
                display: "flex",
                aspectRatio: "1/1",
                width: "1.75rem",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "100%",
                padding: "0.25rem",
                background:
                  typeof color.hex === "string"
                    ? color.hex
                    : `linear-gradient(to bottom, ${color.hex?.[0]}, ${color.hex?.[1]})`,
              }}
            />
          </Box>
        );
      })}
    </Inline>
  );
};
