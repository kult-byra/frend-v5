import { defineQuery } from "next-sanity";
import { portableTextInnerQuery } from "../portable-text/portable-text-inner.query";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    privacyPolicyPage-> {
      "slug": slug.current,
      title
    },
    banner.showBanner == true => {
      "bannerContent": banner.content[] {
        ${portableTextInnerQuery}
      }
    }
  }
`);
