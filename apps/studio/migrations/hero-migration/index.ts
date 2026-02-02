import { at, defineMigration, set, unset } from "sanity/migrate";

// Document types that use the standard `hero` field (i18n documents)
const I18N_DOCUMENT_TYPES = [
  "page",
  "newsArticle",
  "event",
  "caseStudy",
  "knowledgeArticle",
  "seminar",
  "eBook",
  "service",
  "conversionPage",
] as const;

// Archive singletons with hero_no/hero_en fields
const ARCHIVE_SINGLETON_TYPES = [
  "servicesArchive",
  "caseStudyArchive",
  "knowledgeHub",
  "knowledgeArticleArchive",
  "seminarArchive",
  "eBookArchive",
  "newsAndEventsArchive",
  "clientArchive",
] as const;

// Document types that should use articleHero (editorial content with byline)
const ARTICLE_TYPES = ["newsArticle", "knowledgeArticle", "event"] as const;

// Document types that should use formHero
const FORM_TYPES = ["conversionPage"] as const;

type DocumentType = (typeof I18N_DOCUMENT_TYPES)[number];
type ArchiveType = (typeof ARCHIVE_SINGLETON_TYPES)[number];

interface MediaObject {
  _type?: string;
  mediaType?: string;
  image?: {
    _type: string;
    asset: { _ref: string; _type: string };
    crop?: unknown;
    hotspot?: unknown;
    altText?: string;
    caption?: string;
  };
  videoUrl?: string;
  illustration?: string;
  aspectRatio?: string;
}

interface OldDocument {
  _id: string;
  _type: string;
  title?: string;
  excerpt?: unknown[];
  media?: MediaObject;
  links?: unknown[];
  author?: { _ref: string; _type: string };
  publishDate?: string;
  coverImage?: { _type: string; asset: { _ref: string; _type: string } };
  coverImages?: MediaObject[];
  hero?: unknown;
  // Archive singleton fields
  title_no?: string;
  title_en?: string;
  excerpt_no?: unknown[];
  excerpt_en?: unknown[];
  media_no?: MediaObject;
  media_en?: MediaObject;
  links_no?: unknown[];
  links_en?: unknown[];
  hero_no?: unknown;
  hero_en?: unknown;
  // For form pages
  contactForm?: { _ref: string; _type: string };
}

function isArticleType(type: string): boolean {
  return (ARTICLE_TYPES as readonly string[]).includes(type);
}

function isFormType(type: string): boolean {
  return (FORM_TYPES as readonly string[]).includes(type);
}

function hasOldHeroFields(doc: OldDocument): boolean {
  return Boolean(doc.title && !doc.hero);
}

function hasOldArchiveFields(doc: OldDocument): boolean {
  return Boolean((doc.title_no || doc.title_en) && !doc.hero_no && !doc.hero_en);
}

// Convert single coverImage to coverImages array format
function convertCoverImageToArray(
  coverImage: { _type: string; asset: { _ref: string; _type: string } } | undefined,
  media: MediaObject | undefined,
): MediaObject[] | undefined {
  if (coverImage) {
    return [
      {
        _type: "media",
        _key: generateKey(),
        mediaType: "image",
        image: coverImage,
      } as MediaObject,
    ];
  }
  if (media) {
    return [
      {
        ...media,
        _key: generateKey(),
      },
    ];
  }
  return undefined;
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 14);
}

// Build hero object for i18n documents
function buildHero(doc: OldDocument): {
  heroType: string;
  textHero?: unknown;
  mediaHero?: unknown;
  articleHero?: unknown;
  formHero?: unknown;
} {
  const {
    title,
    excerpt,
    media,
    links,
    author,
    publishDate,
    coverImage,
    coverImages,
    contactForm,
  } = doc;

  // Determine hero type based on document type and available fields
  if (isFormType(doc._type)) {
    // Form Hero for conversion pages
    return {
      heroType: "formHero",
      formHero: {
        _type: "formHero",
        title,
        media,
        // Form reference stays at root level, not in hero
      },
    };
  }

  if (isArticleType(doc._type)) {
    // Article Hero for editorial content
    const resolvedCoverImages = coverImages || convertCoverImageToArray(coverImage, media);

    return {
      heroType: "articleHero",
      articleHero: {
        _type: "articleHero",
        title,
        coverImages: resolvedCoverImages,
        author,
        publishDate: publishDate || new Date().toISOString(),
        excerpt,
      },
    };
  }

  if (media) {
    // Media Hero for documents with media
    return {
      heroType: "mediaHero",
      mediaHero: {
        _type: "mediaHero",
        title,
        media,
        excerpt,
        links,
      },
    };
  }

  // Text Hero for documents without media
  return {
    heroType: "textHero",
    textHero: {
      _type: "textHero",
      title,
      excerpt,
      links,
    },
  };
}

// Build hero for archive singletons with _no/_en suffix fields
function buildArchiveHero(
  title: string | undefined,
  excerpt: unknown[] | undefined,
  media: MediaObject | undefined,
  links: unknown[] | undefined,
):
  | {
      heroType: string;
      textHero?: unknown;
      mediaHero?: unknown;
    }
  | undefined {
  if (!title) return undefined;

  if (media) {
    return {
      heroType: "mediaHero",
      mediaHero: {
        _type: "mediaHero",
        title,
        media,
        excerpt,
        links,
      },
    };
  }

  return {
    heroType: "textHero",
    textHero: {
      _type: "textHero",
      title,
      excerpt,
      links,
    },
  };
}

export default defineMigration({
  title: "Migrate hero fields to new hero structure",
  documentTypes: [...I18N_DOCUMENT_TYPES, ...ARCHIVE_SINGLETON_TYPES],

  migrate: {
    document(doc) {
      const oldDoc = doc as unknown as OldDocument;
      const patches = [];

      // Handle i18n documents with standard hero field
      if (
        (I18N_DOCUMENT_TYPES as readonly string[]).includes(doc._type) &&
        hasOldHeroFields(oldDoc)
      ) {
        const hero = buildHero(oldDoc);

        // Set the new hero field
        patches.push(at("hero", set(hero)));

        // Unset old fields that have been migrated
        if (oldDoc.title) patches.push(at("title", unset()));
        if (oldDoc.excerpt) patches.push(at("excerpt", unset()));
        if (oldDoc.media) patches.push(at("media", unset()));
        if (oldDoc.links) patches.push(at("links", unset()));

        // For article types, also unset author, publishDate, coverImage, coverImages
        if (isArticleType(doc._type)) {
          if (oldDoc.author) patches.push(at("author", unset()));
          if (oldDoc.publishDate) patches.push(at("publishDate", unset()));
          if (oldDoc.coverImage) patches.push(at("coverImage", unset()));
          if (oldDoc.coverImages) patches.push(at("coverImages", unset()));
        }

        console.log(`Migrating ${doc._type} "${oldDoc.title}" to ${hero.heroType}`);
      }

      // Handle archive singletons with _no/_en suffix fields
      if (
        (ARCHIVE_SINGLETON_TYPES as readonly string[]).includes(doc._type) &&
        hasOldArchiveFields(oldDoc)
      ) {
        // Build Norwegian hero
        const heroNo = buildArchiveHero(
          oldDoc.title_no,
          oldDoc.excerpt_no,
          oldDoc.media_no,
          oldDoc.links_no,
        );

        // Build English hero
        const heroEn = buildArchiveHero(
          oldDoc.title_en,
          oldDoc.excerpt_en,
          oldDoc.media_en,
          oldDoc.links_en,
        );

        // Set new hero fields
        if (heroNo) patches.push(at("hero_no", set(heroNo)));
        if (heroEn) patches.push(at("hero_en", set(heroEn)));

        // Unset old fields
        if (oldDoc.title_no) patches.push(at("title_no", unset()));
        if (oldDoc.title_en) patches.push(at("title_en", unset()));
        if (oldDoc.excerpt_no) patches.push(at("excerpt_no", unset()));
        if (oldDoc.excerpt_en) patches.push(at("excerpt_en", unset()));
        if (oldDoc.media_no) patches.push(at("media_no", unset()));
        if (oldDoc.media_en) patches.push(at("media_en", unset()));
        if (oldDoc.links_no) patches.push(at("links_no", unset()));
        if (oldDoc.links_en) patches.push(at("links_en", unset()));

        console.log(
          `Migrating archive singleton ${doc._type} - NO: ${heroNo?.heroType || "none"}, EN: ${heroEn?.heroType || "none"}`,
        );
      }

      // Handle archive singletons that might have flat fields with language field
      // (i.e., separate documents per language, like the servicesArchive we saw)
      if (
        (ARCHIVE_SINGLETON_TYPES as readonly string[]).includes(doc._type) &&
        hasOldHeroFields(oldDoc) &&
        !hasOldArchiveFields(oldDoc)
      ) {
        // This singleton has flat fields (title, excerpt, media) with a language field
        // Check which language-specific hero field to use based on the document's language
        const language = (oldDoc as { language?: string }).language;
        const hero = buildHero({
          ...oldDoc,
          _type: "page", // Treat as generic for hero type determination
        });

        if (language === "no") {
          patches.push(at("hero_no", set(hero)));
        } else if (language === "en") {
          patches.push(at("hero_en", set(hero)));
        } else {
          // Default to hero_no if no language specified
          patches.push(at("hero_no", set(hero)));
        }

        // Unset old fields
        if (oldDoc.title) patches.push(at("title", unset()));
        if (oldDoc.excerpt) patches.push(at("excerpt", unset()));
        if (oldDoc.media) patches.push(at("media", unset()));
        if (oldDoc.links) patches.push(at("links", unset()));

        console.log(
          `Migrating archive singleton ${doc._type} (${language || "unknown"}) to hero_${language || "no"}`,
        );
      }

      return patches;
    },
  },
});
