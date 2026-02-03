import { defineQuery } from "next-sanity";

// Field-level i18n: selects locale-specific newsletter signup form
export const newsletterSettingsQuery = defineQuery(`
  *[_id == "newsletterSettings"][0] {
    "newsletterSignup": select(
      $locale == "no" => newsletterSignup_no,
      $locale == "en" => newsletterSignup_en
    )->{
      _id,
      title,
      formId
    }
  }
`);
