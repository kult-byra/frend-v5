import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { heroQuery } from "../utils/hero.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

export const eventQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug && language == $locale][0] {
    _id,
    hero { ${heroQuery} },
    "slug": slug.current,
    timeAndDate,
    location,
    price,
    layout,
    color,
    description,
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const eventSlugsQuery = defineQuery(`
  *[_type == "event"] {
    "slug": slug.current,
    "locale": language
  }
`);
