// groq-fix.js
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find all tagged template expressions using groq
  // biome-ignore lint/complexity/noForEach: internal use
  root
    .find(j.TaggedTemplateExpression, {
      tag: { name: "groq" },
    })
    .forEach((path) => {
      // Get the template literal
      const templateLiteral = path.node.quasi;

      // Create the new defineQuery call expression
      const defineQueryCall = j.callExpression(j.identifier("defineQuery"), [templateLiteral]);

      // Replace the groq tagged template with defineQuery call
      j(path).replaceWith(defineQueryCall);
    });

  // Find and update import statements
  // biome-ignore lint/complexity/noForEach: internal use
  root
    .find(j.ImportDeclaration, {
      source: {
        value: "groq",
      },
    })
    .forEach((path) => {
      path.node.source.value = "next-sanity";
      // Keep existing imports from next-sanity if any
      const existingImports = path.node.specifiers
        .filter((spec) => spec.type === "ImportSpecifier" && spec.imported.name !== "groq")
        .map((spec) => spec.imported.name);

      // Add defineQuery to imports if not already present
      if (!existingImports.includes("defineQuery")) {
        existingImports.push("defineQuery");
      }

      path.node.specifiers = existingImports.map((name) => j.importSpecifier(j.identifier(name)));
    });

  return root.toSource();
}
