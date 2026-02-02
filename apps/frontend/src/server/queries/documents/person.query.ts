import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";
import { metadataQuery } from "../utils/metadata.query";

// Main person query for detail page
export const personQuery = defineQuery(`
  *[_type == "person" && slug.current == $slug && externalPerson != true][0] {
    _id,
    name,
    "slug": slug.current,
    "media": {
      "mediaType": media.mediaType,
      "image": media.image { ${imageQuery} },
      "aspectRatio": media.aspectRatio
    },
    "role": select(
      $locale == "en" => role_en,
      role_no
    ),
    "excerpt": select(
      $locale == "en" => excerpt_en,
      excerpt_no
    ),
    "content": select(
      $locale == "en" => content_en,
      content_no
    )[] {
      _key,
      _type,
      _type == "block" => {
        ${portableTextInnerQuery}
      }
    },
    phone,
    email,
    ${metadataQuery}
  }
`);

// Slugs query for static generation - ONLY internal persons
export const personSlugsQuery = defineQuery(`
  *[_type == "person" && externalPerson != true && defined(slug.current)] {
    "slug": slug.current
  }
`);
