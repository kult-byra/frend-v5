import "@/styles/globals.css";
import "@total-typescript/ts-reset";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { preconnect, prefetchDNS } from "react-dom";
import { env } from "@/env";

const mabry = localFont({
  src: [
    {
      path: "../../public/fonts/mabry-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/mabry-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mabry",
});

export { mabry };

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  applicationName: env.NEXT_PUBLIC_SITE_TITLE,
  title: {
    template: `%s | ${env.NEXT_PUBLIC_SITE_TITLE}`,
    default: env.NEXT_PUBLIC_SITE_TITLE,
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon/favicon-96x96.png",
      sizes: "96x96",
      type: "image/png",
    },
    {
      rel: "shortcut icon",
      url: "/favicon/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/favicon/apple-touch-icon.png",
      sizes: "180x180",
    },
  ],
  manifest: "/favicon/site.webmanifest",
  twitter: { card: "summary_large_image" },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");

  return children;
};

export default RootLayout;
