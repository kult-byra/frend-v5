import { accordionsBlockSchema } from "@/schemas/blocks/accordions.block.schema";
import { callToActionBlockSchema } from "@/schemas/blocks/call-to-action.block.schema";
import { figureBlockSchema } from "@/schemas/blocks/figure.block.schema";
import { logoCloudBlockSchema } from "@/schemas/blocks/logo-cloud.block.schema";
import { mediaGalleryBlockSchema } from "@/schemas/blocks/media-gallery.block.schema";
import { videoBlockSchema } from "@/schemas/blocks/video.block.schema";
import { buttonBlockSchema } from "./button.block.schema";
import { cardsBlockSchema } from "./cards.block.schema";
import { contentBlockSchema } from "./content.block.schema";
import { formBlockSchema } from "./form.block.schema";
import { jobOpeningsBlockSchema } from "./job-openings.block.schema";
import { peopleBlockSchema } from "./people.block.schema";
import { quotesBlockSchema } from "./quotes.block.schema";

export const allBlockSchemas = {
  accordionsBlockSchema,
  figureBlockSchema,
  callToActionBlockSchema,
  logoCloudBlockSchema,
  videoBlockSchema,
  mediaGalleryBlockSchema,
  quotesBlockSchema,
  peopleBlockSchema,
  buttonBlockSchema,
  formBlockSchema,
  cardsBlockSchema,
  jobOpeningsBlockSchema,
  contentBlockSchema,
};
