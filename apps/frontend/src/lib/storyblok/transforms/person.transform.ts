import "server-only";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getMigrationDir } from "@/lib/storyblok/migration-fs";

// ---------- Types ----------

type StoryblokPersonContent = {
  _uid: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  image?: {
    id: number;
    filename: string;
    alt?: string;
  };
  component: "Person";
};

export type StoryblokPersonStory = {
  id: number;
  slug: string;
  full_slug: string;
  updated_at?: string;
  content: StoryblokPersonContent;
};

export type SanityPersonDocument = {
  _id: string;
  _type: "person";
  name: string;
  slug?: { _type: "slug"; current: string };
  email?: string;
  phone?: string;
  role_no: string;
  role_en: string;
  externalPerson: boolean;
  company?: string;
  media?: {
    _type: "media";
    mediaType: "image";
    image: {
      _type: "image";
      asset: { _type: "reference"; _ref: string };
      altText?: string;
    };
  };
};

export type PersonTransformResult = {
  document: SanityPersonDocument;
  imageUrl: string | null;
  slug: string;
  warnings: string[];
};

// ---------- Translation Loader ----------

type TranslationMap = Record<string, string>;

let cachedTranslations: TranslationMap | null = null;

function getTranslationsPath(): string {
  return join(getMigrationDir(), "translations", "person-translations.json");
}

function loadTranslations(): TranslationMap {
  if (cachedTranslations) return cachedTranslations;

  const translationsPath = getTranslationsPath();
  if (!existsSync(translationsPath)) {
    console.warn("No person-translations.json found. English roles will fall back to Norwegian.");
    cachedTranslations = {};
    return cachedTranslations;
  }

  const raw = readFileSync(translationsPath, "utf-8");
  cachedTranslations = JSON.parse(raw) as TranslationMap;
  return cachedTranslations;
}

export function clearTranslationCache() {
  cachedTranslations = null;
}

// ---------- Validation ----------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string | undefined): boolean {
  if (!value || value.trim() === "") return false;
  return EMAIL_REGEX.test(value.trim());
}

// ---------- ID Map (slug → UUID, persisted for idempotency) ----------

type IdMap = Record<string, string>;

let cachedIdMap: IdMap | null = null;

function getIdMapPath(): string {
  return join(getMigrationDir(), "id-maps", "person-ids.json");
}

function loadIdMap(): IdMap {
  if (cachedIdMap) return cachedIdMap;

  const idMapPath = getIdMapPath();
  if (!existsSync(idMapPath)) {
    cachedIdMap = {};
    return cachedIdMap;
  }

  const raw = readFileSync(idMapPath, "utf-8");
  cachedIdMap = JSON.parse(raw) as IdMap;
  return cachedIdMap;
}

function saveIdMap(map: IdMap): void {
  const idMapPath = getIdMapPath();
  const dir = join(getMigrationDir(), "id-maps");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(idMapPath, JSON.stringify(map, null, 2), "utf-8");
  cachedIdMap = map;
}

export function clearIdMapCache() {
  cachedIdMap = null;
}

/** Get or create a stable UUID for a person slug. Persists to disk for idempotency. */
export function personSanityId(slug: string): string {
  const map = loadIdMap();
  if (map[slug]) return map[slug];

  const id = randomUUID();
  map[slug] = id;
  saveIdMap(map);
  return id;
}

// ---------- Transform ----------

export function transformPerson(story: StoryblokPersonStory): PersonTransformResult {
  const { content, slug } = story;
  const warnings: string[] = [];

  const name = content.name?.trim();
  if (!name) {
    warnings.push("Missing name field");
  }

  // Role
  const roleNo = content.role?.trim() || "Ukjent";
  const translations = loadTranslations();
  const roleEn = translations[slug] || roleNo;
  if (!translations[slug]) {
    warnings.push(`No English translation for role "${roleNo}"`);
  }

  // Determine internal vs external based on email containing "frend"
  const rawEmail = content.email?.trim() || "";
  const isFrend = rawEmail.toLowerCase().includes("frend");
  const externalPerson = !isFrend;

  // Email — only keep valid emails
  let email: string | undefined;
  if (isValidEmail(rawEmail)) {
    email = rawEmail;
  }

  // For externals, non-email values in the email field are company names
  let company: string | undefined;
  if (externalPerson && rawEmail && !isValidEmail(rawEmail)) {
    company = rawEmail;
  }

  // Phone
  const phone = content.phone?.trim() || undefined;

  // Image URL (actual upload handled by the server action)
  const imageUrl = content.image?.filename || null;

  const document: SanityPersonDocument = {
    _id: personSanityId(slug),
    _type: "person",
    name: name || "Untitled",
    role_no: roleNo,
    role_en: roleEn,
    externalPerson,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(company ? { company } : {}),
    // Slug only for Frend employees (required by schema validation)
    ...(!externalPerson ? { slug: { _type: "slug" as const, current: slug } } : {}),
  };

  return { document, imageUrl, slug, warnings };
}
