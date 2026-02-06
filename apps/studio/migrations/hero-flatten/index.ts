import { at, defineMigration, set } from "sanity/migrate";

/**
 * Migration: Flatten Hero Structure for Leaf Documents
 *
 * This migration flattens the nested heroField structure for leaf documents.
 *
 * From:
 *   hero.heroType = "articleHero"
 *   hero.articleHero.title
 *   hero.articleHero.media
 *   hero.articleHero.byline
 *   hero.articleHero.excerpt
 *   etc.
 *
 * To:
 *   hero.title
 *   hero.media
 *   hero.byline
 *   hero.excerpt
 *   etc.
 *
 * Run with: npx sanity@latest migration run hero-flatten --dry
 */

// Document types that should use flat hero structure (leaf documents)
const FLAT_HERO_TYPES = [
  "newsArticle",
  "caseStudy",
  "knowledgeArticle",
  "seminar",
  "eBook",
] as const;

interface ArticleHeroData {
  _type?: string;
  title?: string;
  label?: string;
  subheading?: string;
  media?: unknown[];
  byline?: {
    _type?: string;
    author?: { _ref: string; _type: string };
    date?: string;
  };
  excerpt?: unknown[];
}

interface OldDocument {
  _id: string;
  _type: string;
  hero?: {
    heroType?: string;
    articleHero?: ArticleHeroData;
    // Flat fields (if already migrated or using direct type)
    title?: string;
    media?: unknown[];
    byline?: unknown;
    excerpt?: unknown[];
  };
}

function needsMigration(doc: OldDocument): boolean {
  const hero = doc.hero;
  if (!hero) return false;

  // Check if using nested heroField structure
  if (hero.heroType === "articleHero" && hero.articleHero) {
    return true;
  }

  // Also check for heroType without articleHero (edge case)
  if (hero.heroType && hero.articleHero) {
    return true;
  }

  return false;
}

export default defineMigration({
  title: "Flatten hero structure for leaf documents",
  documentTypes: [...FLAT_HERO_TYPES],

  migrate: {
    document(doc) {
      const oldDoc = doc as unknown as OldDocument;
      const patches = [];

      if (!needsMigration(oldDoc)) {
        return patches;
      }

      const hero = oldDoc.hero;
      if (!hero?.articleHero) return patches;

      const articleHero = hero.articleHero;

      // Build the new flat hero object
      const newHero: Record<string, unknown> = {
        _type: "articleHero",
      };

      // Copy all fields from articleHero to the root level
      if (articleHero.title !== undefined) newHero.title = articleHero.title;
      if (articleHero.label !== undefined) newHero.label = articleHero.label;
      if (articleHero.subheading !== undefined) newHero.subheading = articleHero.subheading;
      if (articleHero.media !== undefined) newHero.media = articleHero.media;
      if (articleHero.byline !== undefined) newHero.byline = articleHero.byline;
      if (articleHero.excerpt !== undefined) newHero.excerpt = articleHero.excerpt;

      // Replace the entire hero with the flat structure
      patches.push(at("hero", set(newHero)));

      console.log(`Flattening hero for ${doc._type} "${articleHero.title || doc._id}"`);

      return patches;
    },
  },
});
