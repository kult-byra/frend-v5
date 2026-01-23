import type { LinkableType } from "@workspace/routing/src/linkable-types";
import { resolvePath } from "@workspace/routing/src/resolve-path";

/**
 * Unified link href resolver for menu items.
 * Handles internal links (resolved via routing) and external links.
 */
export function getLinkHref(link: {
  linkType: string;
  _type?: string | null;
  slug?: string | null;
  url?: string;
}): string | null {
  if (link.linkType === "internal" && link._type) {
    // Cast to LinkableType - the _type comes from Sanity which ensures valid types
    return resolvePath(link._type as LinkableType, link.slug ? { slug: link.slug } : {});
  }
  if (link.linkType === "external" && link.url) {
    return link.url;
  }
  return null;
}
