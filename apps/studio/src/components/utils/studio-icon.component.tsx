import { env } from "@/env";

// Vite handles public folder assets - use absolute path from root
export const StudioIcon = () => {
  return (
    <img
      src={new URL("/logo-vinkel-oransj.png", import.meta.url).href}
      alt={env.SANITY_STUDIO_SITE_TITLE}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
};
