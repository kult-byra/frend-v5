import { defineQuery } from "next-sanity";
import { pageBuilderQuery } from "@/server/queries/page-builder/page-builder-full.query";
import { heroQuery } from "@/server/queries/utils/hero.query";
import { metadataQuery } from "@/server/queries/utils/metadata.query";
import { translationsQuery } from "@/server/queries/utils/translations.query";

export const pageQuery = defineQuery(`
  *[_type in ["page", "conversionPage"] && slug.current == $slug && language == $locale][0] {
    _id,
    _type,
    hero { ${heroQuery} },
    ${pageBuilderQuery},
    ${metadataQuery},
    ${translationsQuery},
    // Conversion page specific fields
    _type == "conversionPage" => {
      "highlightedClients": highlightedClients[]-> {
        _id,
        name,
        "logo": logo->logo.asset->url
      },
      "highlightedQuotes": highlightedQuotes[]-> {
        _id,
        quote,
        source {
          name,
          role
        }
      }
    }
  }
`);

export const pageSlugsQuery = defineQuery(`
  *[_type in ["page", "conversionPage"]] {
    "slug": slug.current,
    "locale": language
  }
`);
