import { defineQuery } from "next-sanity";
import { metadataQuery } from "../utils/metadata.query";

// Field-level i18n: selects locale-specific metadata fields
export const metadataSettingsQuery = defineQuery(`
  *[_type == "metadataSettings"][0] {
    "metadata": select(
      $locale == "no" => metadata_no,
      $locale == "en" => metadata_en
    ) {
      ${metadataQuery}
    }
  }
`);
