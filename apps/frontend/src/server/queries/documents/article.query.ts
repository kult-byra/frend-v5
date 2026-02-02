import { defineQuery } from "next-sanity";
import { fullPortableTextQuery } from "../portable-text/portable-text.query";
import { imageInnerQuery } from "../utils/image.query";
import { mediaQuery } from "../utils/media.query";
import { metadataQuery } from "../utils/metadata.query";
import { translationsQuery } from "../utils/translations.query";

// Article hero query for news articles (uses articleHero directly, not the generic hero wrapper)
// @sanity-typegen-ignore
const articleHeroQuery = defineQuery(`
  title,
  media { ${mediaQuery} },
  author-> {
    _id,
    name,
    "slug": slug.current,
    "role": select(
      $locale == "en" => role_en,
      role_no
    ),
    "image": image { ${imageInnerQuery} }
  },
  publishDate,
  excerpt
`);

export const articleQuery = defineQuery(`
  *[_type == "newsArticle" && slug.current == $slug && language == $locale][0] {
    _id,
    "hero": hero.articleHero { ${articleHeroQuery} },
    ${fullPortableTextQuery},
    ${metadataQuery},
    ${translationsQuery}
  }
`);

export const articleSlugsQuery = defineQuery(`
  *[_type == "newsArticle"] {
    "slug": slug.current,
    "locale": language
  }
`);
