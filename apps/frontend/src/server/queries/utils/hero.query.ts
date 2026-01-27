import { defineQuery } from "next-sanity";
import type { HeroTypegenQueryResult } from "@/sanity-types";
import { mediaQuery } from "./media.query";

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
        ${mediaQuery}
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
