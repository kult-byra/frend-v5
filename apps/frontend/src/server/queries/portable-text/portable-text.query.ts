import { defineQuery } from "next-sanity";
import { callToActionBlockQuery } from "../blocks/call-to-action.block.query";
import { figureBlockQuery } from "../blocks/figure.block.query";
import { imageAndTextBlockQuery } from "../blocks/image-and-text.block.query";
import { portableTextInnerQuery } from "./portable-text-inner.query";

// @sanity-typegen-ignore
export const fullPortableTextQuery = defineQuery(`
  content[] {
    _key,
    ...select(
      _type == "block" => {
        ${portableTextInnerQuery}
      },
      _type == "imageAndText.block" => {
        ${imageAndTextBlockQuery}
      },
      _type == "callToAction.block" => {
        ${callToActionBlockQuery}
      },
      _type == "figure" => {
        ${figureBlockQuery}
      },
      _type == "accordion.block" => {
        "_type": "accordion.block",
        heading
      }
    )
  }
`);

const _fullPortableTextQueryType = defineQuery(`
  *[_type == "newsArticle"][0]{
    "_ts": "FullPortableTextQuery",
    ${fullPortableTextQuery}
  }
`);
