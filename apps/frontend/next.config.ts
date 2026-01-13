import type { NextConfig } from "next";
import "./src/env";

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
};
export default config;
