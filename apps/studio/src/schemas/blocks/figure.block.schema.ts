import { figureField } from "@/schemas/generator-fields/figure.field";

export const figureBlockSchema = figureField({
  name: "figure",
  scope: ["portableText"],
});
