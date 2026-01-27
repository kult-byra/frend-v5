import { defineQuery } from "next-sanity";
import { mediaQuery } from "../utils/media.query";

// @sanity-typegen-ignore
export const imageGalleryBlockQuery = defineQuery(`
  _type,
  _key,
  title,
  intro,
  images[] {
    _key,
    _type,
    ${mediaQuery}
  },
  options {
    width,
    galleryTypeHalf,
    galleryTypeFull
  }
`);
