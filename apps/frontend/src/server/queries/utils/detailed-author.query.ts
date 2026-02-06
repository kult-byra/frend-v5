import { defineQuery } from "next-sanity";
import type { DetailedAuthorsTypegenQueryResult } from "@/sanity-types";
import { imageInnerQuery } from "./image.query";

// @sanity-typegen-ignore
export const detailedAuthorsQuery = defineQuery(`
  _id,
  name,
  "slug": slug.current,
  "role": select(
    $locale == "en" => role_en,
    role_no
  ),
  "excerpt": select(
    $locale == "en" => excerpt_en,
    excerpt_no
  ),
  email,
  phone,
  profileLinks[] { _key, title, url },
  "image": media.image { ${imageInnerQuery} }
`);

// For typegen only
const _detailedAuthorsTypegenQuery = defineQuery(`
  *[_type == "newsArticle"][0].hero.byline.authors[]-> {
    _id,
    name,
    "slug": slug.current,
    "role": role_no,
    "excerpt": excerpt_no,
    email,
    phone,
    profileLinks[] { _key, title, url },
    "image": media.image {
      ${imageInnerQuery}
    }
  }
`);

export type DetailedAuthor = NonNullable<DetailedAuthorsTypegenQueryResult>[number];
