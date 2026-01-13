// scripts/prepare-types.js
const fs = require("node:fs");
const path = require("node:path");

// Read the generated types file
const sourceFile = path.join(__dirname, "../apps/frontend/sanity.types.ts");
const destFile = path.join(__dirname, "../packages/sanity-types/sanity.types.ts");

let content = fs.readFileSync(sourceFile, "utf8");

// Find where the module augmentation starts and remove everything from there
const importIndex = content.indexOf('import "@sanity/client"');
if (importIndex !== -1) {
  content = content.substring(0, importIndex);
}

// Write the clean content to the destination file
fs.writeFileSync(destFile, content);

console.log("Types copied with module augmentation removed");
