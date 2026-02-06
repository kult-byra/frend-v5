import { Code } from "lucide-react";
import { defineField } from "sanity";
import { stringField } from "@/schemas/generator-fields/string.field";
import { defineBlock } from "@/schemas/utils/define-block.util";

const SUPPORTED_LANGUAGES = [
  { title: "TypeScript", value: "typescript" },
  { title: "JavaScript", value: "javascript" },
  { title: "Python", value: "python" },
  { title: "HTML", value: "html" },
  { title: "CSS", value: "css" },
  { title: "JSON", value: "json" },
  { title: "Bash", value: "bash" },
  { title: "SQL", value: "sql" },
  { title: "GraphQL", value: "graphql" },
  { title: "GROQ", value: "groq" },
  { title: "Markdown", value: "markdown" },
  { title: "YAML", value: "yaml" },
  { title: "Rust", value: "rust" },
  { title: "Go", value: "go" },
  { title: "Java", value: "java" },
  { title: "C#", value: "csharp" },
  { title: "PHP", value: "php" },
  { title: "Ruby", value: "ruby" },
  { title: "Swift", value: "swift" },
  { title: "Kotlin", value: "kotlin" },
  { title: "Plain Text", value: "text" },
];

/**
 * Returns true when the code block is inside portable text (not directly in page builder).
 * Checks whether the block's _key exists as a direct child of the document's pageBuilder array.
 */
const isPortableTextContext = ({
  document,
  parent,
}: {
  document?: Record<string, unknown>;
  parent?: Record<string, unknown>;
}) => {
  const pageBuilder = document?.pageBuilder;
  if (!Array.isArray(pageBuilder)) return true;
  return !pageBuilder.some((block: Record<string, unknown>) => block._key === parent?._key);
};

export const codeBlockSchema = defineBlock({
  name: "code",
  title: "Code",
  icon: Code,
  scope: ["pageBuilder", "portableText"],
  skipWidth: true,
  fields: [
    stringField({
      name: "heading",
      title: "Heading",
      description: "Heading for the code block (only visible in page builder)",
      hidden: isPortableTextContext,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short description (only visible in page builder)",
      hidden: isPortableTextContext,
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 10,
      description: "The code to display",
      validation: (Rule) => Rule.required().error("Code is required"),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      description: "Programming language for syntax highlighting",
      options: {
        list: SUPPORTED_LANGUAGES,
      },
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      language: "language",
      code: "code",
    },
    prepare({ heading, language, code }) {
      const langLabel = SUPPORTED_LANGUAGES.find((l) => l.value === language)?.title ?? language;
      return {
        title: heading || "Code",
        subtitle: langLabel
          ? `${langLabel} · ${(code ?? "").slice(0, 40)}...`
          : (code ?? "").slice(0, 60),
      };
    },
  },
});
