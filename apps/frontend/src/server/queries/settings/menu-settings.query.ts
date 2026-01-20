import { defineQuery } from "next-sanity";
import { linksQuery } from "../utils/links.query";

// Field-level i18n: selects locale-specific fields and aliases them
// Use _id filter to ensure we get the correct singleton document
export const menuSettingsQuery = defineQuery(`
  *[_id == "menuSettings"][0] {
    "mainMenu": select(
      $locale == "no" => mainMenu_no,
      $locale == "en" => mainMenu_en
    )[] {
      ${linksQuery}
    },
    "secondaryMenu": select(
      $locale == "no" => secondaryMenu_no,
      $locale == "en" => secondaryMenu_en
    )[] {
      ${linksQuery}
    }
  }
`);
