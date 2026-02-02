export type Color = {
  name: string;
  hex: `#${string}` | [`#${string}`, `#${string}`];
};

export const COLORS = [
  {
    name: "white",
    hex: "#fff",
  },
  {
    name: "yellow",
    hex: "#FFB23C",
  },
  {
    name: "navy",
    hex: "#0B0426",
  },
  {
    name: "orange",
    hex: "#FC5000",
  },
] as const satisfies Color[];

export type ColorName = (typeof COLORS)[number]["name"];

export type GradientDirection = "to bottom" | "to top" | "to left" | "to right";

export const getColor = (name: ColorName): Color["hex"] =>
  COLORS.find((c) => c.name === name)?.hex as Color["hex"];
