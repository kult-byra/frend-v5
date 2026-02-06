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
const stickyHeroQuery = defineQuery(`
  title,
  media { ${mediaQuery} },
  ${excerptQuery},
  links[] { ${linksQuery} }
`);

// @sanity-typegen-ignore
const eventWidgetDataQuery = defineQuery(`
  _id,
  title,
  "excerpt": description[] {
    _key,
    _type,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  "slug": slug.current,
  timeAndDate {
    startTime,
    endTime
  }
`);

// @sanity-typegen-ignore
const widgetQuery = defineQuery(`
  useWidget,
  widgetType,
  defaultTitle,
  defaultContent[] {
    _key,
    _type,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  defaultLinks[] { ${linksQuery} },
  eventSelectionMode,
  "eventReference": select(
    eventSelectionMode == "manual" => eventReference-> { ${eventWidgetDataQuery} },
    *[
      _type == "event"
      && language == $locale
      && timeAndDate.startTime >= now()
    ] | order(timeAndDate.startTime asc)[0] { ${eventWidgetDataQuery} }
  ),
  formTitle,
  formReference-> {
    _id,
    title,
    formId
  },
  "newsletterForm": *[_type == "newsletterSettings"][0] {
    "form": select(
      $locale == "no" => newsletterSignup_no,
      $locale == "en" => newsletterSignup_en
    )->{
      _id,
      title,
      formId
    }
  }.form
`);

// @sanity-typegen-ignore
const mediaHeroQuery = defineQuery(`
  title,
  media { ${mediaQuery} },
  ${excerptQuery},
  links[] { ${linksQuery} },
  widget { ${widgetQuery} }
`);

// @sanity-typegen-ignore
const articleHeroQuery = defineQuery(`
  title,
  subheading,
  "media": media[] { _key, ${mediaQuery} },
  byline {
    authors[]-> {
      _id,
      name,
      "slug": slug.current,
      "role": select(
        $locale == "en" => role_en,
        role_no
      ),
      "image": media.image { ${imageInnerQuery} }
    },
    date
  },
  ${excerptQuery}
`);

// Article hero query WITHOUT byline (for caseStudy, seminar, eBook)
// @sanity-typegen-ignore
const articleHeroQueryNoByline = defineQuery(`
  title,
  subheading,
  "media": media[] { _key, ${mediaQuery} },
  ${excerptQuery}
`);

// Direct articleHero query for documents using flat hero structure (not nested heroField)
// WITH byline - use for newsArticle, knowledgeArticle
// @sanity-typegen-ignore
export const directArticleHeroQuery = articleHeroQuery;

// Direct articleHero query WITHOUT byline - use for caseStudy, seminar, eBook
// @sanity-typegen-ignore
export const directArticleHeroQueryNoByline = articleHeroQueryNoByline;

// Nested hero query for documents using heroField (page, frontPage)
// @sanity-typegen-ignore
export const heroQuery = defineQuery(`
  heroType,
  mediaHero { ${mediaHeroQuery} },
  articleHero { ${articleHeroQuery} },
  stickyHero { ${stickyHeroQuery} }
`);

// For typegen only - uses "page" which has all hero types available
const _heroTypegenQuery = defineQuery(`
  *[_type == "page"][0].hero {
    heroType,
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
      links[] { ${linksQuery} },
      widget {
        useWidget,
        widgetType,
        defaultTitle,
        defaultContent[] {
          _key,
          _type,
          _type == "block" => {
            ${portableTextInnerQuery}
          }
        },
        defaultLinks[] { ${linksQuery} },
        eventSelectionMode,
        "eventReference": select(
          eventSelectionMode == "manual" => eventReference-> {
            _id,
            title,
            "excerpt": description[] {
              _key,
              _type,
              _type == "block" => {
                ${portableTextInnerQuery}
              }
            },
            "slug": slug.current,
            timeAndDate {
              startTime,
              endTime
            }
          },
          *[
            _type == "event"
            && language == $locale
            && timeAndDate.startTime >= now()
          ] | order(timeAndDate.startTime asc)[0] {
            _id,
            title,
            "excerpt": description[] {
              _key,
              _type,
              _type == "block" => {
                ${portableTextInnerQuery}
              }
            },
            "slug": slug.current,
            timeAndDate {
              startTime,
              endTime
            }
          }
        ),
        formTitle,
        formReference-> {
          _id,
          title,
          formId
        },
        "newsletterForm": *[_type == "newsletterSettings"][0] {
          "form": select(
            $locale == "no" => newsletterSignup_no,
            $locale == "en" => newsletterSignup_en
          )->{
            _id,
            title,
            formId
          }
        }.form
      }
    },
    articleHero {
      title,
      subheading,
      "media": media[] { _key, ${mediaQuery} },
      byline {
        authors[]-> {
          _id,
          name,
          "slug": slug.current,
          "role": role_no,
          "image": media.image { ${imageInnerQuery} }
        },
        date
      },
      excerpt[] {
        _key,
        _type,
        _type == "block" => {
          ${portableTextInnerQuery}
        }
      }
    },
    stickyHero {
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
    }
  }
`);

export type HeroData = NonNullable<HeroTypegenQueryResult>;
export type MediaHeroData = NonNullable<HeroData["mediaHero"]>;
export type ArticleHeroData = NonNullable<HeroData["articleHero"]>;
export type StickyHeroData = NonNullable<HeroData["stickyHero"]>;
export type WidgetData = NonNullable<MediaHeroData["widget"]>;

// Backward compatibility aliases (deprecated)
export type HeroQueryProps = HeroData;
