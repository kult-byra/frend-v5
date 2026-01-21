import { mediaField } from "@/schemas/generator-fields/media.field";

export const figureBlockSchema = mediaField({
  name: "figure",
  scope: ["portableText"],
  video: true,
});
