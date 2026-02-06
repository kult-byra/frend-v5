import { at, defineMigration, set, unset } from "sanity/migrate";

/**
 * Migration: Byline single author → authors array
 *
 * Converts byline.author (single reference) to byline.authors (array of references)
 * so that articles can have up to 3 authors.
 *
 * Handles two document structures:
 *
 * 1. Flat hero (newsArticle, knowledgeArticle):
 *    hero.byline.author → hero.byline.authors
 *
 * 2. Nested hero via heroField (page, conversionPage):
 *    hero.articleHero.byline.author → hero.articleHero.byline.authors
 */

// Document types using flat articleHeroField with useByline: true
const FLAT_HERO_TYPES = ["newsArticle", "knowledgeArticle"] as const;

// Document types using heroField with articleHero (which includes byline)
const NESTED_HERO_TYPES = ["page", "conversionPage"] as const;

const ALL_TYPES = [...FLAT_HERO_TYPES, ...NESTED_HERO_TYPES] as const;

interface AuthorRef {
  _ref: string;
  _type: string;
  _key?: string;
}

interface OldByline {
  _type?: string;
  author?: AuthorRef;
  authors?: AuthorRef[];
  date?: string;
}

interface OldDocument {
  _id: string;
  _type: string;
  hero?: {
    heroType?: string;
    articleHero?: {
      byline?: OldByline;
    };
    byline?: OldByline;
  };
}

function migrateByline(byline: OldByline, pathPrefix: string) {
  const patches = [];

  // Already migrated
  if (byline.authors) return patches;

  // No author to migrate
  if (!byline.author) return patches;

  const authorRef = {
    ...byline.author,
    _key: crypto.randomUUID().slice(0, 8),
  };

  patches.push(at(`${pathPrefix}.authors`, set([authorRef])));
  patches.push(at(`${pathPrefix}.author`, unset()));

  return patches;
}

export default defineMigration({
  title: "Convert byline.author to byline.authors array",
  documentTypes: [...ALL_TYPES],

  migrate: {
    document(doc) {
      const oldDoc = doc as unknown as OldDocument;
      const hero = oldDoc.hero;
      if (!hero) return [];

      // Flat hero structure (hero.byline)
      if (hero.byline?.author && !hero.byline.authors) {
        const patches = migrateByline(hero.byline, "hero.byline");
        if (patches.length > 0) {
          console.log(
            `Migrating ${doc._type} "${doc._id}" — hero.byline.author → hero.byline.authors`,
          );
        }
        return patches;
      }

      // Nested hero structure (hero.articleHero.byline)
      const articleByline = hero.articleHero?.byline;
      if (articleByline?.author && !articleByline.authors) {
        const patches = migrateByline(articleByline, "hero.articleHero.byline");
        if (patches.length > 0) {
          console.log(
            `Migrating ${doc._type} "${doc._id}" — hero.articleHero.byline.author → hero.articleHero.byline.authors`,
          );
        }
        return patches;
      }

      return [];
    },
  },
});
