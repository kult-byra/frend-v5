import { defineQuery } from "next-sanity";
import type { FullLinksTypegenQueryResult } from "@/sanity-types";
import { imageInnerQuery } from "./image.query";

// @sanity-typegen-ignore
const internalLinkQuery = defineQuery(`
  "linkType": "internal",
  "title": coalesce(
    customTitle,
    internalLink->title,
    internalLink->name
  ),
  "slug": internalLink->slug.current,
  "_type": internalLink->_type,
  description,
  buttonVariant
`);
// @sanity-typegen-ignore
const externalLinkQuery = defineQuery(`
  "linkType": "external",
  "title": coalesce(
    customTitle,
    href
  ),
  "url": href,
  description,
  buttonVariant
`);

// @sanity-typegen-ignore
const downloadLinkQuery = defineQuery(`
  "linkType": "download",
  "title": coalesce(
      customTitle,
      file.asset->originalFilename
    ),
  "url": file.asset->url,
  description,
  buttonVariant
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
  },
  linkGroups[] {
    _key,
    title,
    links[] {
      _key,
      _type == "internalLinkObject" => {${internalLinkQuery}},
      _type == "link" => {${externalLinkQuery}}
    }
  },
  contactForm-> {
    _id,
    title,
    formId
  },
  image {
    ${imageInnerQuery}
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

export type LinkProps = RemoveKeyFromUnion<
  LinksTypeGen,
  "_key" | "title" | "description" | "buttonVariant"
>;

export type InternalLinkProps = Extract<LinkProps, { linkType: "internal" }>;
export type ExternalLinkProps = Extract<LinkProps, { linkType: "external" }>;
export type DownloadLinkProps = Extract<LinkProps, { linkType: "download" }>;
export type LinkGroupProps = Extract<LinkProps, { linkType: "linkGroup" }>;

export type LinksProps = RemoveKeyFromUnion<LinksTypeGen, "description">[];
