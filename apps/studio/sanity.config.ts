import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { media, mediaAssetSource } from "sanity-plugin-media";
import "./styles.css";

import type { Tool } from "sanity";
import { defineDocuments, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { WrapperField } from "@/components/fields/wrapper-field";
import { StudioIcon } from "@/components/utils/studio-icon.component";
import { env } from "@/env";
import { initialValueTemplates } from "@/initial-value-templates";
import { presentationLocations, presentationMainRoutes } from "@/presentation/presentation-helpers";
import { schemaTypes } from "@/schemas";
import { structure } from "@/structure/structure";
import { brandGuidelinesTool } from "@/tools/brand-guidelines-tool/brand-guidelines.tool";
import { fathomTool } from "@/tools/fathom/fathom.tool";
import { hubspotTool } from "@/tools/hubspot";
import { kultDashboardTool } from "@/tools/kult-dashboard/kult-dashboard.tool";
import { kultResourcesDashboardTool } from "@/tools/kult-dashboard/kult-resources.tool";
import { STUDIO_BASE_PATH } from "@/utils/studio-base-path.util";

const config = defineConfig({
  basePath: `/${STUDIO_BASE_PATH}`,
  title: env.SANITY_STUDIO_SITE_TITLE,
  dataset: env.SANITY_STUDIO_DATASET,
  projectId: env.SANITY_STUDIO_PROJECT_ID,
  schema: {
    types: schemaTypes,
    templates: initialValueTemplates,
  },
  icon: StudioIcon,

  plugins: [
    structureTool({ structure }),
    media(),
    ...(process.env.NODE_ENV === "development" ? [visionTool()] : []),
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
  ],
  tools: [
    fathomTool(),
    hubspotTool(),
    ...(env.SANITY_STUDIO_BRAND_GUIDELINES_URL
      ? [brandGuidelinesTool({ locale: "no", type: "brand" })]
      : []),
    ...(env.SANITY_STUDIO_KULT_DASHBOARD_URL ? [kultDashboardTool()] : []),
    ...(env.SANITY_STUDIO_KULT_DASHBOARD_RESOURCES_URL ? [kultResourcesDashboardTool()] : []),
  ] as Tool[],

  form: {
    components: {
      field: WrapperField,
    },

    image: {
      assetSources: () => [mediaAssetSource],
    },
    file: {
      assetSources: () => [mediaAssetSource],
    },
  },
});

export default config;
