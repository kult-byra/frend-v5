import { defineQuery } from "next-sanity";
import { callToActionBlockQuery } from "../blocks/call-to-action.block.query";
import { figureBlockQuery } from "../blocks/figure.block.query";
import { imageAndTextBlockQuery } from "../blocks/image-and-text.block.query";
import { portableTextInnerQuery } from "./portable-text-inner.query";

// @sanity-typegen-ignore
export const fullPortableTextQuery = defineQuery(`
  content[] {
    _key,
    _type,
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
      _type == "accordions.block" => {
        "_type": "accordions.block",
        accordions[] {
          _key,
          heading,
          content[] {
            _key,
            _type == "block" => {
              ${portableTextInnerQuery}
            }
          }
        }
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
