import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { media, mediaAssetSource } from "sanity-plugin-media";
import "./styles.css";

const languages = [
  { id: "no", title: "Norsk 🇧🇻" },
  { id: "en", title: "English 🇬🇧" },
] as const;

// Document types that support internationalization
const i18nSchemaTypes = [
  "page",
  "frontPage",
  "conversionPage",
  "newsArticle",
  "event",
  "newsAndEventsArchive",
  "knowledgeArticle",
  "knowledgeHub",
  "knowledgeArticleArchive",
  "service",
  "subService",
  "servicesArchive",
  "seminar",
  "seminarArchive",
  "caseStudy",
  "caseStudyArchive",
  "eBook",
  "eBookArchive",
  "client",
  "clientArchive",
  "person",
  "jobOpening",
  "siteSettings",
  "menuSettings",
  "footerSettings",
  "metadataSettings",
];

import type { Tool } from "sanity";
import { defineDocuments, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { WrapperField } from "@/components/fields/wrapper-field";
import { StudioIcon } from "@/components/utils/studio-icon.component";
import { env } from "@/env";
import { initialValueTemplates } from "@/initial-value-templates";
import { presentationLocations, presentationMainRoutes } from "@/presentation/presentation-helpers";
import { schemaTypes } from "@/schemas";
import { createLanguageStructure } from "@/structure/structure";
import { brandGuidelinesTool } from "@/tools/brand-guidelines-tool/brand-guidelines.tool";
import { fathomTool } from "@/tools/fathom/fathom.tool";
import { hubspotTool } from "@/tools/hubspot";
import { kultDashboardTool } from "@/tools/kult-dashboard/kult-dashboard.tool";
import { kultResourcesDashboardTool } from "@/tools/kult-dashboard/kult-resources.tool";
import { STUDIO_BASE_PATH } from "@/utils/studio-base-path.util";

// Shared configuration for plugins
const getPlugins = (languageId: string) => [
  structureTool({ structure: createLanguageStructure(languageId, i18nSchemaTypes) }),
  media(),
  ...(process.env.NODE_ENV === "development" ? [visionTool()] : []),
  documentInternationalization({
    supportedLanguages: [...languages],
    schemaTypes: i18nSchemaTypes,
  }),
  presentationTool({
    previewUrl: {
      draftMode: {
        enable: `${env.SANITY_STUDIO_FRONTEND_URL}/api/draft`,
      },
    },
    resolve: {
      mainDocuments: defineDocuments([...presentationMainRoutes]),
      locations: {
        ...presentationLocations,
      },
    },
  }),
];

// Shared tools configuration
const getTools = (languageId: (typeof languages)[number]["id"]) => {
  const tools: Tool[] = [fathomTool(), hubspotTool()];

  const brandTool = brandGuidelinesTool({ locale: languageId, type: "brand" });
  if (brandTool) tools.push(brandTool);

  const kultTool = kultDashboardTool();
  if (kultTool) tools.push(kultTool);

  const kultResourcesTool = kultResourcesDashboardTool();
  if (kultResourcesTool) tools.push(kultResourcesTool);

  return tools;
};

// Shared form configuration
const formConfig = {
  components: {
    field: WrapperField,
  },
  image: {
    assetSources: () => [mediaAssetSource],
  },
  file: {
    assetSources: () => [mediaAssetSource],
  },
};

// Generate workspace configs for each language
const config = defineConfig(
  languages.map((language) => ({
    name: language.id,
    basePath: `/${STUDIO_BASE_PATH}/${language.id}`,
    title: `${env.SANITY_STUDIO_SITE_TITLE} | ${language.title}`,
    dataset: env.SANITY_STUDIO_DATASET,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    schema: {
      types: schemaTypes,
      templates: initialValueTemplates,
    },
    icon: StudioIcon,
    plugins: getPlugins(language.id),
    tools: getTools(language.id),
    form: formConfig,
  }))
);

export default config;
