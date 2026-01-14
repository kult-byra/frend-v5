import type { StructureResolver } from "sanity/structure";
import { articlesStructure } from "@/structure/articles.structure";
import { settingsStructure } from "@/structure/settings.structure";
import { servicesStructure } from "@/structure/services.structure";
import { knowledgeHubStructure } from "./knowledge-hub.structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innhold")
    .items([
      settingsStructure(S),

      S.divider(),

      S.documentTypeListItem("frontPage").title("Forside"),
      S.documentTypeListItem("page").title("Sider"),

      S.divider(),

      articlesStructure(S),

      S.divider(),
      
      servicesStructure(S),

      S.divider(),

      knowledgeHubStructure(S),
    ]);
