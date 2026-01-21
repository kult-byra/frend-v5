import { Briefcase } from "lucide-react";
import { defineBlock } from "@/schemas/utils/define-block.util";
import { infoField } from "../generator-fields/info.field";
import { portableTextField } from "../generator-fields/portable-text/portable-text.field";
import { stringField } from "../generator-fields/string.field";

export const jobOpeningsBlockSchema = defineBlock({
  name: "jobOpenings",
  title: "Job openings",
  icon: Briefcase,
  scope: ["pageBuilder"],
  fields: [
    stringField({
      title: "Heading",
      name: "heading",
    }),
    portableTextField({
      title: "Description",
      name: "description",
      noContent: true,
      includeLists: true,
    }),
    infoField({
      title: "Automatically generated content",
      description: "All published job openings are displayed automatically.",
      tone: "positive",
      icon: Briefcase,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Job openings",
      };
    },
  },
});
