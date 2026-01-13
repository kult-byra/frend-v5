import type { MetadataRoute } from "next";
import { env } from "@/env";

// this function removes the trailing slash
function sanitizeUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export default function robots(): MetadataRoute.Robots {
  const sanitizedUrl = sanitizeUrl(env.NEXT_PUBLIC_SITE_URL ?? "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/", // replace with the paths you want to disallow
    },
    sitemap: `${sanitizedUrl}/sitemap.xml`,
  };
}
