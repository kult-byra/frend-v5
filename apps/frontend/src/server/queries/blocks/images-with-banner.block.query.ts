import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { linksQuery } from "../utils/links.query";
import { mediaQuery } from "../utils/media.query";

// @sanity-typegen-ignore
export const imagesWithBannerBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  "content": text[] {
    _key,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  ctaType,
  link[] {
    ${linksQuery}
  },
  images[] {
    _key,
    _type,
    ${mediaQuery}
  },
  options { width }
`);
