import { BetweenHorizonalStart, MoveHorizontal } from "lucide-react";
import { gridOptionsField } from "./grid-options.field";

/**
 * Pre-configured width field for page builder blocks.
 * Automatically added to all blocks via defineBlock.
 */
export const widthField = () =>
  gridOptionsField({
    name: "width",
    title: "Width",
    description: "Choose the width for this block",
    options: [
      {
        value: "halfWidth",
        title: "Half Width",
        description: "Content takes half the width, aligned right",
        icon: BetweenHorizonalStart,
      },
      {
        value: "fullWidth",
        title: "Full Width",
        description: "Content spans the full width of the page",
        icon: MoveHorizontal,
      },
    ],
    initialValue: "halfWidth",
  });
