import { env } from "@/env";

export const StudioIcon = () => {
  return <img src="/favicon/apple-touch-icon.png" alt={env.SANITY_STUDIO_SITE_TITLE} />;
};
