import { defineQuery } from "next-sanity";
import { metadataQuery } from "../utils/metadata.query";

export const metadataSettingsQuery = defineQuery(`
  *[_type == "metadataSettings"][0] {
    ${metadataQuery}
  }
`);
