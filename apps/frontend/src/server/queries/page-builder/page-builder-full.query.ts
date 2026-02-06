import { defineQuery } from "next-sanity";
import { callToActionBlockQuery } from "@/server/queries/blocks/call-to-action.block.query";
import { cardsBlockQuery } from "@/server/queries/blocks/cards.block.query";
import { contentBlockQuery } from "@/server/queries/blocks/content.block.query";
import { imageAndTextBlockQuery } from "@/server/queries/blocks/image-and-text.block.query";
import { jobOpeningsBlockQuery } from "@/server/queries/blocks/job-openings.block.query";
import { logoCloudBlockQuery } from "@/server/queries/blocks/logo-cloud.block.query";
import { mediaGalleryBlockQuery } from "@/server/queries/blocks/media-gallery.block.query";
import { peopleBlockQuery } from "@/server/queries/blocks/people.block.query";
import { quotesBlockQuery } from "@/server/queries/blocks/quotes.block.query";

//@sanity-typegen-ignore
export const pageBuilderInnerQuery = defineQuery(`
  _type,
  _key,
  options,
  ...select(
    _type == "callToAction.block" => {${callToActionBlockQuery}},
    _type == "imageAndText.block" => {${imageAndTextBlockQuery}},
    _type == "content.block" => {${contentBlockQuery}},
    _type == "cards.block" => {${cardsBlockQuery}},
    _type == "quotes.block" => {${quotesBlockQuery}},
    _type == "people.block" => {${peopleBlockQuery}},
    _type == "logoCloud.block" => {${logoCloudBlockQuery}},
    _type == "jobOpenings.block" => {${jobOpeningsBlockQuery}},
    _type == "mediaGallery.block" => {${mediaGalleryBlockQuery}}
  )
`);

//@sanity-typegen-ignore
export const pageBuilderQuery = defineQuery(`
  pageBuilder[]{
    ${pageBuilderInnerQuery}
  }
`);

// For typegen only
const _pageBuilderTypegenQuery = defineQuery(`
  *[_type == "page"][0].pageBuilder[] {
   ${pageBuilderInnerQuery}
  }
`);
