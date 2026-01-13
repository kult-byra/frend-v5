import { defineQuery } from "next-sanity";
import { callToActionBlockQuery } from "@/server/queries/blocks/call-to-action.block.query";
import { imageAndTextBlockQuery } from "@/server/queries/blocks/image-and-text.block.query";

//@sanity-typegen-ignore
export const pageBuilderInnerQuery = defineQuery(`
   _type,
  _key,
  ...select(
    _type == "callToAction.block" => {${callToActionBlockQuery}},
    _type == "imageAndText.block" => {${imageAndTextBlockQuery}}
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
