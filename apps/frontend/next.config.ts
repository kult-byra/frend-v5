import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import "./src/env";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  transpilePackages: ["@workspace/routing"],
  reactStrictMode: true,
  reactCompiler: true,
  // TODO: Enable when next-sanity supports cache components
  // cacheComponents: true,
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  logging: {
    fetches: { fullUrl: false },
  },
  async redirects() {
    return [
      // Redirect old standalone archives to new knowledge subpages
      // Norwegian paths
      {
        source: "/prosjekter",
        destination: "/kunnskap/prosjekter",
        permanent: true,
      },
      {
        source: "/seminarer",
        destination: "/kunnskap/seminarer",
        permanent: true,
      },
      {
        source: "/e-boker",
        destination: "/kunnskap/e-boker",
        permanent: true,
      },
      // English paths
      {
        source: "/en/projects",
        destination: "/en/knowledge/case-studies",
        permanent: true,
      },
      {
        source: "/en/seminars",
        destination: "/en/knowledge/seminars",
        permanent: true,
      },
      {
        source: "/en/ebooks",
        destination: "/en/knowledge/ebooks",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(config);
