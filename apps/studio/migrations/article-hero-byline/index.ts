import { at, defineMigration, set, unset } from "sanity/migrate";

/**
 * Migration: Article Hero Byline Restructure
 *
 * This migration restructures articleHero fields from:
 *   hero.articleHero.author (reference)
 *   hero.articleHero.publishDate (datetime)
 *
 * To:
 *   hero.articleHero.byline.author (reference)
 *   hero.articleHero.byline.date (datetime)
 *
 * It also handles documents that use direct `type: "articleHero"` where
 * fields are at hero.author and hero.publishDate instead of nested.
 */

// Document types that use articleHero
const ARTICLE_HERO_TYPES = [
  "newsArticle",
  "caseStudy",
  "knowledgeArticle",
  "seminar",
  "eBook",
] as const;

interface ArticleHeroOld {
  title?: string;
  media?: unknown[];
  author?: { _ref: string; _type: string };
  publishDate?: string;
  excerpt?: unknown[];
  label?: string;
  subheading?: string;
  byline?: {
    _type?: string;
    author?: { _ref: string; _type: string };
    date?: string;
  };
}

interface OldDocument {
  _id: string;
  _type: string;
  hero?: {
    heroType?: string;
    articleHero?: ArticleHeroOld;
    // For documents using direct type: "articleHero" (flat structure)
    title?: string;
    author?: { _ref: string; _type: string };
    publishDate?: string;
    media?: unknown[];
    excerpt?: unknown[];
  };
}

function needsMigration(doc: OldDocument): boolean {
  const hero = doc.hero;
  if (!hero) return false;

  // Check for heroField structure (hero.articleHero.author/publishDate)
  const articleHero = hero.articleHero;
  if (articleHero) {
    // Already has byline - skip
    if (articleHero.byline) return false;
    // Has old fields to migrate
    if (articleHero.author || articleHero.publishDate) return true;
  }

  // Check for flat structure (hero.author/publishDate) - old direct type: "articleHero"
  if (!hero.heroType && (hero.author || hero.publishDate)) {
    return true;
  }

  return false;
}

export default defineMigration({
  title: "Restructure articleHero author/publishDate to byline",
  documentTypes: [...ARTICLE_HERO_TYPES],

  migrate: {
    document(doc) {
      const oldDoc = doc as unknown as OldDocument;
      const patches = [];

      if (!needsMigration(oldDoc)) {
        return patches;
      }

      const hero = oldDoc.hero;
      if (!hero) return patches;

      // Handle heroField structure (hero.articleHero)
      const articleHero = hero.articleHero;
      if (articleHero && (articleHero.author || articleHero.publishDate)) {
        // Build byline object
        const byline = {
          _type: "byline",
          author: articleHero.author,
          date: articleHero.publishDate || new Date().toISOString(),
        };

        // Set new byline field
        patches.push(at("hero.articleHero.byline", set(byline)));

        // Unset old fields
        if (articleHero.author) {
          patches.push(at("hero.articleHero.author", unset()));
        }
        if (articleHero.publishDate) {
          patches.push(at("hero.articleHero.publishDate", unset()));
        }

        console.log(
          `Migrating ${doc._type} "${articleHero.title || doc._id}" - restructured author/publishDate to byline`,
        );
      }

      // Handle flat structure (hero.author/publishDate) - for backward compat
      if (!hero.heroType && (hero.author || hero.publishDate)) {
        // This is a document using direct type: "articleHero"
        // Need to restructure to heroField format

        const byline = {
          _type: "byline",
          author: hero.author,
          date: hero.publishDate || new Date().toISOString(),
        };

        // Build new articleHero structure
        const newArticleHero = {
          _type: "articleHero",
          title: hero.title,
          media: hero.media,
          excerpt: hero.excerpt,
          byline,
        };

        // Set new hero structure
        patches.push(
          at(
            "hero",
            set({
              heroType: "articleHero",
              articleHero: newArticleHero,
            }),
          ),
        );

        console.log(
          `Migrating ${doc._type} "${hero.title || doc._id}" - converted flat hero to heroField structure with byline`,
        );
      }

      return patches;
    },
  },
});
