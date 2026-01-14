import { accordionsBlockSchema } from "@/schemas/blocks/accordions.block.schema";
import { callToActionBlockSchema } from "@/schemas/blocks/call-to-action.block.schema";
import { figureBlockSchema } from "@/schemas/blocks/figure.block.schema";
import { imageAndTextBlockSchema } from "@/schemas/blocks/image-and-text.block.schema";
import { imageGalleryBlockSchema } from "@/schemas/blocks/image-gallery.block.schema";
import { logoCloudBlockSchema } from "@/schemas/blocks/logo-cloud.block.schema";
import { videoBlockSchema } from "@/schemas/blocks/video.block.schema";
import { quotesBlockSchema } from "./quotes.block.schema";
import { peopleBlockSchema } from "./people.block.schema";
import { buttonBlockSchema } from "./button.block.schema";
import { formBlockSchema } from "./form.block.schema";
import { cardsBlockSchema } from "./cards.block.schema";
import { imageWithBannerBlockSchema } from "./image-with-banner.block.schema";

export const allBlockSchemas = {
  imageAndTextBlockSchema,
  accordionsBlockSchema,
  figureBlockSchema,
  callToActionBlockSchema,
  logoCloudBlockSchema,
  videoBlockSchema,
  imageGalleryBlockSchema,
  quotesBlockSchema,
  peopleBlockSchema,
  buttonBlockSchema,
  formBlockSchema,
  cardsBlockSchema,
  imageWithBannerBlockSchema,
};
