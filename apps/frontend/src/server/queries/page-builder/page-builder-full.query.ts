import { defineQuery } from "next-sanity";
import { callToActionBlockQuery } from "@/server/queries/blocks/call-to-action.block.query";
import { cardsBlockQuery } from "@/server/queries/blocks/cards.block.query";
import { contentBlockQuery } from "@/server/queries/blocks/content.block.query";
import { imageAndTextBlockQuery } from "@/server/queries/blocks/image-and-text.block.query";
import { imagesAndTextBlockQuery } from "@/server/queries/blocks/images-and-text.block.query";
import { imagesWithBannerBlockQuery } from "@/server/queries/blocks/images-with-banner.block.query";

//@sanity-typegen-ignore
export const pageBuilderInnerQuery = defineQuery(`
   _type,
  _key,
  ...select(
    _type == "callToAction.block" => {${callToActionBlockQuery}},
    _type == "imageAndText.block" => {${imageAndTextBlockQuery}},
    _type == "imagesAndText.block" => {${imagesAndTextBlockQuery}},
    _type == "content.block" => {${contentBlockQuery}},
    _type == "cards.block" => {${cardsBlockQuery}},
    _type == "imagesWithBanner.block" => {${imagesWithBannerBlockQuery}}
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
