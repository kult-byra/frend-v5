"use client";

import { load, trackPageview } from "fathom-client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { FathomSecretsProps } from "./fathom-secrets-namespace.util";

export const TrackPageView = (props: FathomSecretsProps) => {
  const { fathomSiteId, fathomSites } = props ?? {};

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sites = fathomSites?.split(",");

  useEffect(() => {
    if (!fathomSiteId) return;

    if (!sites || sites.length < 0) {
      console.warn("Fathom enabled but no sites defined");
      return;
    }

    load(fathomSiteId, {
      includedDomains: sites,
    });
  }, [fathomSiteId, sites]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should run when pathname or searchParams change
  useEffect(() => {
    trackPageview();

    // Record a pageview when route changes
  }, [pathname, searchParams]);

  return null;
};
