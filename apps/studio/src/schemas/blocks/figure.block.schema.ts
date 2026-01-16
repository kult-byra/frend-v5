import { figureOrVideoField } from "@/schemas/generator-fields/figure-or-video-field";

export const figureBlockSchema = figureOrVideoField({
  name: "figure",
  scope: ["portableText"],
});
