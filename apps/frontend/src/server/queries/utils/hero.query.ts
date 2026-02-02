import { defineQuery } from "next-sanity";
import type { HeroTypegenQueryResult } from "@/sanity-types";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageInnerQuery } from "./image.query";
import { linksQuery } from "./links.query";
import { mediaQuery } from "./media.query";

// @sanity-typegen-ignore
const excerptQuery = defineQuery(`
  excerpt[] {
    _key,
    _type,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  }
`);

// @sanity-typegen-ignore
const textHeroQuery = defineQuery(`
  title,
  ${excerptQuery},
  links[] { ${linksQuery} }
`);

// @sanity-typegen-ignore
const mediaHeroQuery = defineQuery(`
  title,
  media { ${mediaQuery} },
  ${excerptQuery},
  links[] { ${linksQuery} }
`);

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
    "image": media.image { ${imageInnerQuery} }
  },
  publishDate,
  ${excerptQuery}
`);

// @sanity-typegen-ignore
const formHeroQuery = defineQuery(`
  title,
  media { ${mediaQuery} },
  form-> {
    _id,
    title,
    formId
  }
`);

// @sanity-typegen-ignore
export const heroQuery = defineQuery(`
  heroType,
  textHero { ${textHeroQuery} },
  mediaHero { ${mediaHeroQuery} },
  articleHero { ${articleHeroQuery} },
  formHero { ${formHeroQuery} }
`);

// For typegen only
const _heroTypegenQuery = defineQuery(`
  *[_type == "frontPage"][0].hero {
    heroType,
    textHero {
      title,
      excerpt[] {
        _key,
        _type,
        _type == "block" => {
          ${portableTextInnerQuery}
        }
      },
      links[] { ${linksQuery} }
    },
    mediaHero {
      title,
      media { ${mediaQuery} },
      excerpt[] {
        _key,
        _type,
        _type == "block" => {
          ${portableTextInnerQuery}
        }
      },
      links[] { ${linksQuery} }
    },
    articleHero {
      title,
      media { ${mediaQuery} },
      author-> {
        _id,
        name,
        "slug": slug.current,
        "role": role_no,
        "image": media.image { ${imageInnerQuery} }
      },
      publishDate,
      excerpt[] {
        _key,
        _type,
        _type == "block" => {
          ${portableTextInnerQuery}
        }
      }
    },
    formHero {
      title,
      media { ${mediaQuery} },
      form-> {
        _id,
        title,
        formId
      }
    }
  }
`);

export type HeroData = NonNullable<HeroTypegenQueryResult>;
export type TextHeroData = NonNullable<HeroData["textHero"]>;
export type MediaHeroData = NonNullable<HeroData["mediaHero"]>;
export type ArticleHeroData = NonNullable<HeroData["articleHero"]>;
export type FormHeroData = NonNullable<HeroData["formHero"]>;

// Backward compatibility aliases (deprecated)
export type HeroQueryProps = HeroData;
export type MediaAndFormHeroQueryProps = FormHeroData;
