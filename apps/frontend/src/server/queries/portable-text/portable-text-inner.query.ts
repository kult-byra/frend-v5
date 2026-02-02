import { defineQuery } from "next-sanity";

// @sanity-typegen-ignore
const linkInPortableTextQuery = defineQuery(`
  "_ts": "LinkInPortableTextQuery",
  "url": href
`);

// @sanity-typegen-ignore
const internalLinkObjectInPortableTextQuery = defineQuery(`
  "_ts": "InternalLinkObjectInPortableTextQuery",
  internalLink-> {
    _type,
    "slug": slug.current
  }
`);

// @sanity-typegen-ignore
const downloadLinkObjectInPortableTextQuery = defineQuery(`
  "_ts": "DownloadLinkObjectInPortableTextQuery",
  "url": file.asset->url
`);

// @sanity-typegen-ignore
export const portableTextInnerQuery = defineQuery(`
  "_ts": "PortableTextInnerQuery",
  ...,
  markDefs[] {
    ...,
    _type == "link" => {
      ${linkInPortableTextQuery}
    },
    _type == "internalLinkObject" => {
      ${internalLinkObjectInPortableTextQuery}
    },
    _type == "downloadLinkObject" => {
      ${downloadLinkObjectInPortableTextQuery}
    }
  }
`);

// @sanity-typegen-ignore
export const portableTextQuery = defineQuery(`
  content[] {
    _key,
    _type,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  }
`);
