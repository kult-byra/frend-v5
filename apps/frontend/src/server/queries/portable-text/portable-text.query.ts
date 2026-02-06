import { defineQuery } from "next-sanity";
import { callToActionBlockQuery } from "../blocks/call-to-action.block.query";
import { figureBlockQuery } from "../blocks/figure.block.query";
import { imageAndTextBlockQuery } from "../blocks/image-and-text.block.query";
import { logoCloudBlockQuery } from "../blocks/logo-cloud.block.query";
import { mediaGalleryBlockQuery } from "../blocks/media-gallery.block.query";
import { peopleBlockQuery } from "../blocks/people.block.query";
import { quotesBlockQuery } from "../blocks/quotes.block.query";
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
      },
      _type == "mediaGallery.block" => {
        ${mediaGalleryBlockQuery}
      },
      _type == "logoCloud.block" => {
        ${logoCloudBlockQuery}
      },
      _type == "people.block" => {
        ${peopleBlockQuery}
      },
      _type == "quotes.block" => {
        ${quotesBlockQuery}
      },
      _type == "button.block" => {
        "_type": "button.block",
        _key,
        button[] {
          _key,
          _type,
          linkType,
          url,
          internalLink,
          text,
          variant
        }
      },
      _type == "video.block" => {
        "_type": "video.block",
        _key,
        url
      },
      _type == "form.block" => {
        "_type": "form.block",
        _key,
        form-> {
          _id,
          title,
          formId
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
