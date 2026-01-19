import { defineQuery } from "next-sanity";
import type { FullLinksTypegenQueryResult } from "@/sanity-types";

// @sanity-typegen-ignore
const internalLinkQuery = defineQuery(`
  "linkType": "internal",
  ...(internalLink-> {
    "title": coalesce(
      ^.customTitle,
      title,
      name
    ),
    "slug": slug.current,
    _type
  }),
  description
`);
// @sanity-typegen-ignore
const externalLinkQuery = defineQuery(`
  "linkType": "external",
  "title": coalesce(
    customTitle,
    href
  ),
  "url": href,
  description
`);

// @sanity-typegen-ignore
const downloadLinkQuery = defineQuery(`
  "linkType": "download",
  "title": coalesce(
      customTitle,
      file.asset->originalFilename
    ),
  "url": file.asset->url,
  description
`);

// @sanity-typegen-ignore
const linkGroupQuery = defineQuery(`
  "linkType": "linkGroup",
  title,
  menuType,
  links {
    mainLinks[] {
      _key,
      _type == "internalLinkObject" => {${internalLinkQuery}},
      _type == "link" => {${externalLinkQuery}}
    },
    secondaryLinks[] {
      _key,
      _type == "internalLinkObject" => {${internalLinkQuery}},
      _type == "link" => {${externalLinkQuery}}
    }
  }
`);

// @sanity-typegen-ignore
export const linksQuery = defineQuery(`
  _key,
  _type == "internalLinkObject" => {${internalLinkQuery}},
  _type == "link" => {${externalLinkQuery}},
  _type == "downloadLinkObject" => {${downloadLinkQuery}},
  _type == "linkGroup" => {${linkGroupQuery}}
  
`);

const _fullLinksTypegenQuery = defineQuery(`*[_type == "typegenSettings"][0]{
  fullLinks[]{
    ${linksQuery}
  }
}`);

type LinksTypeGen = NonNullable<NonNullable<FullLinksTypegenQueryResult>["fullLinks"]>[number];

type RemoveKeyFromUnion<T, K extends string> = T extends unknown ? Omit<T, K> : never;

export type LinkProps = RemoveKeyFromUnion<LinksTypeGen, "_key" | "title" | "description">;

export type InternalLinkProps = Extract<LinkProps, { linkType: "internal" }>;
export type ExternalLinkProps = Extract<LinkProps, { linkType: "external" }>;
export type DownloadLinkProps = Extract<LinkProps, { linkType: "download" }>;
export type LinkGroupProps = Extract<LinkProps, { linkType: "linkGroup" }>;

export type LinksProps = RemoveKeyFromUnion<LinksTypeGen, "description">[];
