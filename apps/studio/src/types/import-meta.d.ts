interface ImportMetaEnv extends Record<string, string | undefined> {
  readonly SANITY_STUDIO_SITE_TITLE: string;
  readonly SANITY_STUDIO_PROJECT_ID: string;
  readonly SANITY_STUDIO_DATASET: string;
  readonly SANITY_STUDIO_API_VERSION: string;
  readonly SANITY_STUDIO_FRONTEND_URL: string;
  readonly SANITY_STUDIO_BRAND_GUIDELINES_URL?: string;
  readonly SANITY_STUDIO_KULT_DASHBOARD_URL?: string;
  readonly SANITY_STUDIO_KULT_DASHBOARD_RESOURCES_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
