import { defineQuery } from "next-sanity";
import { pageBuilderInnerQuery } from "../page-builder/page-builder-full.query";
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
    "preFooter": select(
      $locale == "no" => pageBuilder_no,
      $locale == "en" => pageBuilder_en
    )[] {
      ${pageBuilderInnerQuery}
    },
    illustration,
    "mobileIllustration": mobileIllustration.illustration,
    contactForm->{
      _id,
      title
    }
  }
`);
