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
const eventWidgetDataQuery = defineQuery(`
  _id,
  "title": hero.articleHero.title,
  "excerpt": hero.articleHero.excerpt[] {
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
  "newsletterForm": *[_id == "newsletterSettings"][0] {
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
            "title": hero.articleHero.title,
            "excerpt": hero.articleHero.excerpt[] {
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
            "title": hero.articleHero.title,
            "excerpt": hero.articleHero.excerpt[] {
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
        "newsletterForm": *[_id == "newsletterSettings"][0] {
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
export type WidgetData = NonNullable<MediaHeroData["widget"]>;

// Backward compatibility aliases (deprecated)
export type HeroQueryProps = HeroData;
export type MediaAndFormHeroQueryProps = FormHeroData;
