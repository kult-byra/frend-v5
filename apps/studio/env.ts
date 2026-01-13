import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "SANITY_STUDIO_",

  client: {
    SANITY_STUDIO_SITE_TITLE: z.string().min(1),
    SANITY_STUDIO_PROJECT_ID: z.string().min(1),
    SANITY_STUDIO_DATASET: z.string().min(1),
    SANITY_STUDIO_API_VERSION: z.string().min(1),
    SANITY_STUDIO_FRONTEND_URL: z.string().min(1),
    SANITY_STUDIO_BRAND_GUIDELINES_URL: z.string().optional(),
    SANITY_STUDIO_KULT_DASHBOARD_URL: z.string().optional(),
    SANITY_STUDIO_KULT_DASHBOARD_RESOURCES_URL: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_VALIDATION === "true",
});
