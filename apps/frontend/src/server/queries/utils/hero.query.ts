import { defineQuery } from "next-sanity";
import type { HeroTypegenQueryResult } from "@/sanity-types";
import { imageInnerQuery } from "./image.query";
import { linksQuery } from "./links.query";
import { mediaQuery } from "./media.query";

// @sanity-typegen-ignore
const textHeroQuery = defineQuery(`
  title,
  excerpt,
  links[] { ${linksQuery} }
`);

// @sanity-typegen-ignore
const mediaHeroQuery = defineQuery(`
  title,
  media { ${mediaQuery} },
  excerpt,
  links[] { ${linksQuery} }
`);

// @sanity-typegen-ignore
const articleHeroQuery = defineQuery(`
  title,
  coverImages[] { ${mediaQuery} },
  author-> {
    _id,
    name,
    "image": image { ${imageInnerQuery} }
  },
  publishDate,
  excerpt
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
      excerpt,
      links[] { ${linksQuery} }
    },
    mediaHero {
      title,
      media { ${mediaQuery} },
      excerpt,
      links[] { ${linksQuery} }
    },
    articleHero {
      title,
      coverImages[] { ${mediaQuery} },
      author-> {
        _id,
        name,
        "image": image { ${imageInnerQuery} }
      },
      publishDate,
      excerpt
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
