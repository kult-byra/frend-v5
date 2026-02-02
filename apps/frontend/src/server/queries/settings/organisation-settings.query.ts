import { defineQuery } from "next-sanity";
import { linksQuery } from "../utils/links.query";

// Organisation settings are shared across languages
export const organisationSettingsQuery = defineQuery(`
  *[_id == "organisationSettings"][0] {
    address {
      street,
      city,
      zipCode
    },
    phoneNumber,
    email,
    socialMediaLinks[] {
      ${linksQuery}
    },
    certifications[] {
      _key,
      title,
      logo-> {
        title,
        "url": logo.asset->url
      }
    }
  }
`);
