import type { StructureResolver } from "sanity/structure";
import { articlesStructure } from "@/structure/articles.structure";
import { settingsStructure } from "@/structure/settings.structure";
import { servicesStructure } from "@/structure/services.structure";
import { knowledgeHubStructure } from "./knowledge-hub.structure";
import { clientsStructure } from "./clients.structure";
import { organisationStructure } from "./organisation.structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      settingsStructure(S),

      S.divider(),

      S.documentTypeListItem("frontPage").title("Front page"),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("conversionPage").title("Conversion pages"),

      S.divider(),

      articlesStructure(S),

      knowledgeHubStructure(S),

      S.divider(),
      
      servicesStructure(S),

      clientsStructure(S),

      S.divider(),

      organisationStructure(S),
    ]);
