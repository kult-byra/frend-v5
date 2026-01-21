import { defineQuery } from "next-sanity";
import type { HeroTypegenQueryResult, PageBuilderTypegenQueryResult } from "@/sanity-types";
import { pageBuilderQuery } from "../page-builder/page-builder-full.query";
import { heroQuery } from "../utils/hero.query";
import { translationsQuery } from "../utils/translations.query";

// @sanity-typegen-ignore
export const frontPageQuery = defineQuery(`
  *[_type == "siteSettings" && language == $locale][0].frontPage-> {
    _id,
    hero { ${heroQuery} },
    ${pageBuilderQuery},
    ${translationsQuery}
  }
`);

// Compose the type from separate typegen queries
export type FrontPageQueryProps = {
  _id: string;
  hero: HeroTypegenQueryResult | null;
  pageBuilder: PageBuilderTypegenQueryResult;
  _translations: Array<{ slug: string; language: string }>;
};
