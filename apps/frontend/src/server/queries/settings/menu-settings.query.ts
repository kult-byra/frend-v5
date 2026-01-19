import { defineQuery } from "next-sanity";
import { linksQuery } from "../utils/links.query";

export const menuSettingsQuery = defineQuery(`
  *[_type == "menuSettings" && language == $locale][0] {
    mainMenu[] {
      ${linksQuery}
    },
    secondaryMenu[] {
      ${linksQuery}
    }
  }
`);
