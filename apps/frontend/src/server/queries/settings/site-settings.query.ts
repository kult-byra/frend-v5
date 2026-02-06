import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";
import { imageInnerQuery } from "../utils/image.query";

// Field-level i18n: selects locale-specific fields and aliases them
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    "videoPlaceholder": videoPlaceholder {
      ${imageInnerQuery}
    },
    "privacyPolicyPage": select(
      $locale == "no" => privacyPolicyPage_no,
      $locale == "en" => privacyPolicyPage_en
    )-> {
      "slug": slug.current,
      title
    },
    "banner": select(
      $locale == "no" => banner_no,
      $locale == "en" => banner_en
    ),
    select(
      $locale == "no" => banner_no.showBanner == true,
      $locale == "en" => banner_en.showBanner == true
    ) => {
      "bannerContent": select(
        $locale == "no" => banner_no.content,
        $locale == "en" => banner_en.content
      )[] {
        ${portableTextInnerQuery}
      }
    }
  }
`);
