import { defineCliConfig } from "sanity/cli";
import tsconfigPaths from "vite-tsconfig-paths";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

export default defineCliConfig({
  api: { projectId, dataset },
  vite: {
    define: {
      "process.env.SANITY_STUDIO_PROJECT_ID": JSON.stringify(projectId),
      "process.env.SANITY_STUDIO_DATASET": JSON.stringify(dataset),
    },
    plugins: [tsconfigPaths()],
  },
});
