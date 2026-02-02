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

// Inline query for knowledge teaser data in menu highlights
// @sanity-typegen-ignore
const knowledgeHighlightTeaserQuery = defineQuery(`
  _id,
  _type,
  title,
  "slug": slug.current,
  "image": media.image {
    ${imageInnerQuery}
  }
`);

// Inline query for news article teaser in menu
// @sanity-typegen-ignore
const newsArticleTeaserQuery = defineQuery(`
  _id,
  _type,
  title,
  "slug": slug.current,
  publishDate,
  "image": media.image {
    ${imageInnerQuery}
  }
`);

// Inline query for event teaser in menu
// @sanity-typegen-ignore
const eventTeaserQuery = defineQuery(`
  _id,
  _type,
  title,
  "slug": slug.current,
  "startTime": timeAndDate.startTime,
  "excerpt": pt::text(description),
  "image": media.image {
    ${imageInnerQuery}
  }
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
  },
  // Knowledge menu highlight
  "knowledgeHighlight": select(
    menuType == "knowledge" && knowledgeHighlight.mode == "latest" => {
      "mode": "latest",
      "document": *[
        _type in ["knowledgeArticle", "caseStudy", "eBook", "seminar"]
        && language == $locale
        && !(_id in path("drafts.**"))
      ] | order(_createdAt desc)[0] {
        ${knowledgeHighlightTeaserQuery}
      }
    },
    menuType == "knowledge" && knowledgeHighlight.mode == "manual" => {
      "mode": "manual",
      "document": knowledgeHighlight.document-> {
        ${knowledgeHighlightTeaserQuery}
      }
    }
  ),
  // News and Events menu - auto-generated content
  "latestNews": select(
    menuType == "newsAndEvents" => *[
      _type == "newsArticle"
      && language == $locale
      && !(_id in path("drafts.**"))
    ] | order(publishDate desc)[0...2] {
      ${newsArticleTeaserQuery}
    }
  ),
  "upcomingEvents": select(
    menuType == "newsAndEvents" => *[
      _type == "event"
      && language == $locale
      && !(_id in path("drafts.**"))
      && timeAndDate.startTime > now()
    ] | order(timeAndDate.startTime asc)[0...1] {
      ${eventTeaserQuery}
    }
  )
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
