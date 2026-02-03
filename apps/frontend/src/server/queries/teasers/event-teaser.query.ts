import { defineQuery } from "next-sanity";
import type { EventTeaserTypegenQueryResult } from "@/sanity-types";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageQuery } from "../utils/image.query";

// @sanity-typegen-ignore
export const eventTeaserQuery = defineQuery(`
  _id,
  _type,
  "title": hero.articleHero.title,
  "slug": slug.current,
  "image": hero.articleHero.media.image {
    ${imageQuery}
  },
  timeAndDate {
    startTime,
    endTime
  },
  location,
  description[] {
    _key,
    _type == "block" => {
      ${portableTextInnerQuery}
    }
  },
  "services": services[]->{
    _id,
    "title": coalesce(title_no, title_en)
  },
  "technologies": technologies[]->{
    _id,
    title
  },
  "industries": industries[]->{
    _id,
    title
  },
  signupForm->{
    _id,
    formId
  }
`);

// For typegen
const _eventTeaserTypegenQuery = defineQuery(`
  *[_type == "event"][0]{
    ${eventTeaserQuery}
  }
`);

export type EventTeaserProps = NonNullable<EventTeaserTypegenQueryResult>;
