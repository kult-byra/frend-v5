import { defineQuery } from "next-sanity";
import { imageInnerQuery } from "../utils/image.query";
import { linksQuery } from "../utils/links.query";

// Field-level i18n: selects locale-specific fields and aliases them
export const footerSettingsQuery = defineQuery(`
  *[_id == "footerSettings"][0] {
    "footerLinks": select(
      $locale == "no" => footerLinks_no,
      $locale == "en" => footerLinks_en
    )[] {
      ${linksQuery}
    },
    illustration {
      ${imageInnerQuery}
    }
  }
`);
