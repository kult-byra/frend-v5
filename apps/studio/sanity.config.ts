import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import type { DocumentBadgeComponent, NewDocumentOptionsContext, TemplateItem, Tool } from "sanity";
import { defineConfig } from "sanity";
import { defineDocuments, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { media, mediaAssetSource } from "sanity-plugin-media";

import { MissingLanguageBadge, MissingLanguageInput } from "@/components/document";
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
import { I18N_SCHEMA_TYPES } from "@/utils/i18n-schema-types.util";
import { STUDIO_BASE_PATH } from "@/utils/studio-base-path.util";

import "./styles.css";

const languages = [
  { id: "no", title: "Norsk 🇧🇻" },
  { id: "en", title: "English 🇬🇧" },
] as const;

// Shared configuration for plugins
const getPlugins = (languageId: string) => [
  structureTool({ structure: createLanguageStructure(languageId, [...I18N_SCHEMA_TYPES]) }),
  media(),
  

  /** Sanity  */
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

  ...(process.env.NODE_ENV === "development" ? [visionTool()] : []),

  // Document internationalization plugin ("Translations" button)
  documentInternationalization({
    supportedLanguages: [...languages],
    schemaTypes: [...I18N_SCHEMA_TYPES],
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
    input: MissingLanguageInput,
  },
  image: {
    assetSources: () => [mediaAssetSource],
  },
  file: {
    assetSources: () => [mediaAssetSource],
  },
};

// Document configuration factory for each language workspace
const getDocumentConfig = (languageId: string) => ({
  
  
  // Badges for i18n documents
  badges: (prev: DocumentBadgeComponent[], context: { schemaType: string }) => {
    if ((I18N_SCHEMA_TYPES as readonly string[]).includes(context.schemaType)) {
      return [...prev, MissingLanguageBadge];
    }
    return prev;
  },

  // Filter new document options to only show templates for the current workspace language
  newDocumentOptions: (prev: TemplateItem[], _context: NewDocumentOptionsContext) => {
    const otherLanguages = languages.filter((l) => l.id !== languageId).map((l) => l.id);
    return prev.filter(
      (item) => !otherLanguages.some((lang) => item.templateId.endsWith(`-${lang}`)),
    );
  },
});

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
    document: getDocumentConfig(language.id),
  })),
);

export default config;
