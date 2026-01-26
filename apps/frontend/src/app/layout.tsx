import "@/styles/globals.css";
import "@total-typescript/ts-reset";

import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import { preconnect, prefetchDNS } from "react-dom";
import { env } from "@/env";

const suisseIntl = localFont({
  src: [
    {
      path: "../../public/fonts/SuisseIntl-Regular.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "../../public/fonts/SuisseIntl-RegularIt.woff2",
      weight: "450",
      style: "italic",
    },
    {
      path: "../../public/fonts/SuisseIntl-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/SuisseIntl-SemiboldIt.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-suisse-intl",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export { suisseIntl, dmMono };

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

  // Vimeo player preconnects
  preconnect("https://player.vimeo.com");
  preconnect("https://i.vimeocdn.com");
  preconnect("https://f.vimeocdn.com");

  return children;
};

export default RootLayout;
