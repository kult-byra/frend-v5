import { defineQuery } from "next-sanity";
import type { HeroTypegenQueryResult } from "@/sanity-types";
import { imageQuery } from "./image.query";

// @sanity-typegen-ignore
const mediaQuery = defineQuery(`
  mediaType,
  image { ${imageQuery} },
  videoUrl
`);

// @sanity-typegen-ignore
const mediaAndFormHeroQuery = defineQuery(`
  heroText,
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
  mediaAndFormHero { ${mediaAndFormHeroQuery} }
`);

// For typegen only
const _heroTypegenQuery = defineQuery(`
  *[_type == "frontPage"][0].hero {
    heroType,
    mediaAndFormHero {
      heroText,
      media {
        mediaType,
        image { ${imageQuery} },
        videoUrl
      },
      form-> {
        _id,
        title,
        formId
      }
    }
  }
`);

export type HeroQueryProps = NonNullable<HeroTypegenQueryResult>;
export type MediaAndFormHeroQueryProps = NonNullable<HeroQueryProps["mediaAndFormHero"]>;
