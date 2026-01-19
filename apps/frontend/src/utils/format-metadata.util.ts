import type { Metadata } from "next";
import { stegaClean, toPlainText } from "next-sanity";
import type { MetaDataQuery } from "@/server/queries/utils/metadata.query";
import { urlForImageId } from "@/server/sanity/sanity-image";

// Convert description to string - handles both string and portable text array
const getDescriptionString = (desc: MetaDataQuery["desc"]): string | undefined => {
  if (!desc) return undefined;
  if (typeof desc === "string") return desc;
  if (Array.isArray(desc)) return toPlainText(desc);
  return undefined;
};

export const formatMetadata = (
  metadata: MetaDataQuery | undefined,
  noIndex?: boolean,
): Metadata => {
  if (!metadata) return {};

  const cleanedMetadata = stegaClean(metadata);

  const { title, desc, image, tags, noIndex: metadataNoIndex } = cleanedMetadata || {};

  const imageAlt = image?.altText ?? "";
  const description = getDescriptionString(desc);

  return {
    title,
    ...(description ? { description } : {}),
    ...(tags ? { keywords: tags } : {}),
    openGraph: {
      title: title ?? undefined,
      ...(description ? { description } : {}),
      ...(image?.id
        ? {
            images: [
              {
                url: urlForImageId(image.id, { width: 800, height: 600 }) ?? "",
                width: 800,
                height: 600,
                alt: imageAlt,
              },
              {
                url: urlForImageId(image.id, { width: 1200, height: 630 }) ?? "",
                width: 1200,
                height: 630,
                alt: imageAlt,
              },
              {
                url: urlForImageId(image.id, { width: 1800, height: 1600 }) ?? "",
                width: 1800,
                height: 1600,
                alt: imageAlt,
              },
            ],
          }
        : {}),
    },
    ...(noIndex || metadataNoIndex ? noIndexMetadata : {}),
  };
};

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
