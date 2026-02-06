import { defineQuery } from "next-sanity";
import { mediaQuery } from "../utils/media.query";

// @sanity-typegen-ignore
export const mediaGalleryBlockQuery = defineQuery(`
  _type,
  _key,
  title,
  intro,
  media[] {
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
