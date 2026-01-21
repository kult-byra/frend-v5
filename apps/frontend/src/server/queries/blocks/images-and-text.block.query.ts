import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";
import { linksQuery } from "../utils/links.query";

// @sanity-typegen-ignore
export const imagesAndTextBlockQuery = defineQuery(`
  _type,
  _key,
  heading,
  "content": content[] {
    _key,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  links[] {
    ${linksQuery}
  },
  images[] {
    _key,
    _type,
    mediaType,
    image { ${imageQuery} },
    videoUrl
  }
`);
