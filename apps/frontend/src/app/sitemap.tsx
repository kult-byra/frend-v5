import { resolvePath } from "@workspace/routing/src/resolve-path";
import type { MetadataRoute } from "next";
import type { LinkableType } from "@/custom.types";
import { env } from "@/env";

import { fetchSitemap } from "@/server/queries/paths/sitemap.query";

async function createSitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchSitemap();
  const sitemap: MetadataRoute.Sitemap = [];

  const { pages, frontPage } = data ?? {};

  // Add frontPage to the sitemap
  if (frontPage) {
    sitemap.push({
      url: `${env.NEXT_PUBLIC_SITE_URL}`, // replace 'acme.com' with your actual domain
      lastModified: frontPage._updatedAt,
    });
  }

  function sanitizeUrl(url: string) {
    if (url.endsWith("/")) {
      return url.slice(0, -1); // removes the last character if it's a '/'
    }
    return url;
  }

  // Add all other pages to the sitemap

  for (const page of pages) {
    const sanitizedUrl = sanitizeUrl(env.NEXT_PUBLIC_SITE_URL);

    const pageType = page._type as LinkableType;

    sitemap.push({
      url: `${sanitizedUrl}${resolvePath(pageType, page.slug ? { slug: page.slug } : {})}`,
      lastModified: page._updatedAt,
    });
  }

  return sitemap;
}

export default createSitemap;
