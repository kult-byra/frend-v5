import { accordionsBlockSchema } from "@/schemas/blocks/accordions.block.schema";
import { callToActionBlockSchema } from "@/schemas/blocks/call-to-action.block.schema";
import { figureBlockSchema } from "@/schemas/blocks/figure.block.schema";
import { imageGalleryBlockSchema } from "@/schemas/blocks/image-gallery.block.schema";
import { imagesAndTextBlockSchema } from "@/schemas/blocks/images-and-text.block.schema";
import { logoCloudBlockSchema } from "@/schemas/blocks/logo-cloud.block.schema";
import { videoBlockSchema } from "@/schemas/blocks/video.block.schema";
import { buttonBlockSchema } from "./button.block.schema";
import { cardsBlockSchema } from "./cards.block.schema";
import { contentBlockSchema } from "./content.block.schema";
import { formBlockSchema } from "./form.block.schema";
import { imageCarouselBlockSchema } from "./image-carousel.block.schema";
import { imagesWithBannerBlockSchema } from "./images-with-banner.block.schema";
import { jobOpeningsBlockSchema } from "./job-openings.block.schema";
import { peopleBlockSchema } from "./people.block.schema";
import { quotesBlockSchema } from "./quotes.block.schema";

export const allBlockSchemas = {
  imagesAndTextBlockSchema,
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
  imagesWithBannerBlockSchema,
  imageCarouselBlockSchema,
  jobOpeningsBlockSchema,
  contentBlockSchema,
};
