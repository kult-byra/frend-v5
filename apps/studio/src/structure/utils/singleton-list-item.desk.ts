import type { DocumentDefinition } from "sanity";

import type { StructureBuilder } from "sanity/structure";

export const singletonListItem = (S: StructureBuilder, schema: DocumentDefinition) =>
  S.listItem()
    .title(schema.title ?? schema.name)
    .icon(schema.icon)
    .child(S.document().schemaType(schema.name).documentId(schema.name));
