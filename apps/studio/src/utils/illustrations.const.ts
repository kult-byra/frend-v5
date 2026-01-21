/** Service area categories for area-icons */
export type AreaCategory = "crm" | "ai" | "service" | "teknologi" | "utvikler" | "nocode";

export const AREA_CATEGORY_LABELS: Record<AreaCategory, string> = {
  crm: "CRM",
  ai: "Generativ AI",
  service: "Service",
  teknologi: "Teknologi",
  utvikler: "Utvikler",
  nocode: "No-code/Low-code",
} as const;

type IllustrationMeta = {
  name: string;
  label: string;
  /**
   * "light" = dark-colored SVG, use on LIGHT backgrounds (#FFFFFF)
   * "dark" = light-colored SVG, use on DARK backgrounds (#0B0426)
   */
  mode: "light" | "dark";
  type: "icon" | "illustration" | "area-icon";
  /** Only for area-icons: which service area this icon belongs to */
  category?: AreaCategory;
};

/** Display labels for modes - clarifies usage context */
export const MODE_LABELS = {
  light: "For light backgrounds",
  dark: "For dark backgrounds",
} as const;

export const ILLUSTRATIONS = [
  // Light Mode - Illustrations
  { name: "light-bubbles-01", label: "Bubbles 1", mode: "light", type: "illustration" },
  { name: "light-bubbles-02", label: "Bubbles 2", mode: "light", type: "illustration" },
  { name: "light-choices", label: "Choices", mode: "light", type: "illustration" },
  { name: "light-collaboration", label: "Collaboration", mode: "light", type: "illustration" },
  { name: "light-competition-01", label: "Competition 1", mode: "light", type: "illustration" },
  { name: "light-competition-02", label: "Competition 2", mode: "light", type: "illustration" },
  { name: "light-confused", label: "Confused", mode: "light", type: "illustration" },
  { name: "light-confused-team", label: "Confused Team", mode: "light", type: "illustration" },
  { name: "light-cooperation", label: "Cooperation", mode: "light", type: "illustration" },
  { name: "light-direction", label: "Direction", mode: "light", type: "illustration" },
  { name: "light-growth", label: "Growth", mode: "light", type: "illustration" },
  { name: "light-idea", label: "Idea", mode: "light", type: "illustration" },
  { name: "light-meeting-01", label: "Meeting 1", mode: "light", type: "illustration" },
  { name: "light-meeting-02", label: "Meeting 2", mode: "light", type: "illustration" },
  { name: "light-pie-chart", label: "Pie Chart", mode: "light", type: "illustration" },
  { name: "light-strategy-card", label: "Strategy Card", mode: "light", type: "illustration" },
  { name: "light-strategy-chess", label: "Strategy Chess", mode: "light", type: "illustration" },
  { name: "light-victorys", label: "Victory", mode: "light", type: "illustration" },

  // Light Mode - Icons
  { name: "light-icon-award", label: "Award", mode: "light", type: "icon" },
  { name: "light-icon-chess", label: "Chess", mode: "light", type: "icon" },
  { name: "light-icon-chessboard", label: "Chessboard", mode: "light", type: "icon" },
  { name: "light-icon-hourglass", label: "Hourglass", mode: "light", type: "icon" },
  { name: "light-icon-light-bulb", label: "Light Bulb", mode: "light", type: "icon" },
  { name: "light-icon-timer", label: "Timer", mode: "light", type: "icon" },
  { name: "light-icon-trophy", label: "Trophy", mode: "light", type: "icon" },

  // Dark Mode - Illustrations
  { name: "dark-bubbles-01", label: "Bubbles 1", mode: "dark", type: "illustration" },
  { name: "dark-bubbles-02", label: "Bubbles 2", mode: "dark", type: "illustration" },
  { name: "dark-choices", label: "Choices", mode: "dark", type: "illustration" },
  { name: "dark-collaboration", label: "Collaboration", mode: "dark", type: "illustration" },
  { name: "dark-competition-01", label: "Competition 1", mode: "dark", type: "illustration" },
  { name: "dark-competition-02", label: "Competition 2", mode: "dark", type: "illustration" },
  { name: "dark-confused", label: "Confused", mode: "dark", type: "illustration" },
  { name: "dark-confused-team", label: "Confused Team", mode: "dark", type: "illustration" },
  { name: "dark-cooperation", label: "Cooperation", mode: "dark", type: "illustration" },
  { name: "dark-direction", label: "Direction", mode: "dark", type: "illustration" },
  { name: "dark-growth", label: "Growth", mode: "dark", type: "illustration" },
  { name: "dark-idea", label: "Idea", mode: "dark", type: "illustration" },
  { name: "dark-meeting-01", label: "Meeting 1", mode: "dark", type: "illustration" },
  { name: "dark-meeting-02", label: "Meeting 2", mode: "dark", type: "illustration" },
  { name: "dark-pie-chart", label: "Pie Chart", mode: "dark", type: "illustration" },
  { name: "dark-strategy-card", label: "Strategy Card", mode: "dark", type: "illustration" },
  { name: "dark-strategy-chess", label: "Strategy Chess", mode: "dark", type: "illustration" },
  { name: "dark-victorys", label: "Victory", mode: "dark", type: "illustration" },

  // Dark Mode - Icons
  { name: "dark-icon-award", label: "Award", mode: "dark", type: "icon" },
  { name: "dark-icon-chess", label: "Chess", mode: "dark", type: "icon" },
  { name: "dark-icon-chessboard", label: "Chessboard", mode: "dark", type: "icon" },
  { name: "dark-icon-hourglass", label: "Hourglass", mode: "dark", type: "icon" },
  { name: "dark-icon-timer", label: "Timer", mode: "dark", type: "icon" },
  { name: "dark-icon-trophy", label: "Trophy", mode: "dark", type: "icon" },

  // Area Icons - organized by background type
  // -01 variants: for LIGHT backgrounds (dark purple #0b0426 outlines)
  // -02 variants: for DARK backgrounds (purple #955eff structural)
  // -03 variants: for DARK backgrounds (near-black #040022 outlines, alternative style)

  // CRM
  { name: "light-area-crm-01", label: "CRM", mode: "light", type: "area-icon", category: "crm" },
  { name: "light-area-crm-02", label: "CRM", mode: "dark", type: "area-icon", category: "crm" },
  { name: "light-area-crm-03", label: "CRM", mode: "dark", type: "area-icon", category: "crm" },

  // Service
  {
    name: "light-area-service-01",
    label: "Service",
    mode: "light",
    type: "area-icon",
    category: "service",
  },
  {
    name: "light-area-service-02",
    label: "Service",
    mode: "dark",
    type: "area-icon",
    category: "service",
  },
  {
    name: "light-area-service-03",
    label: "Service",
    mode: "dark",
    type: "area-icon",
    category: "service",
  },

  // Teknologi
  {
    name: "light-area-teknologi-01",
    label: "Teknologi",
    mode: "light",
    type: "area-icon",
    category: "teknologi",
  },
  {
    name: "light-area-teknologi-02",
    label: "Teknologi",
    mode: "dark",
    type: "area-icon",
    category: "teknologi",
  },
  {
    name: "light-area-teknologi-03",
    label: "Teknologi",
    mode: "dark",
    type: "area-icon",
    category: "teknologi",
  },

  // Utvikler
  {
    name: "light-area-utvikler-01",
    label: "Utvikler",
    mode: "light",
    type: "area-icon",
    category: "utvikler",
  },
  {
    name: "light-area-utvikler-02",
    label: "Utvikler",
    mode: "dark",
    type: "area-icon",
    category: "utvikler",
  },
  {
    name: "light-area-utvikler-03",
    label: "Utvikler",
    mode: "dark",
    type: "area-icon",
    category: "utvikler",
  },

  // No-code/Low-code
  {
    name: "light-area-nocode-01",
    label: "No-code/Low-code",
    mode: "light",
    type: "area-icon",
    category: "nocode",
  },
  {
    name: "light-area-nocode-02",
    label: "No-code/Low-code",
    mode: "dark",
    type: "area-icon",
    category: "nocode",
  },
  {
    name: "light-area-nocode-03",
    label: "No-code/Low-code",
    mode: "dark",
    type: "area-icon",
    category: "nocode",
  },

  // Generativ AI
  {
    name: "light-area-ai-01",
    label: "Generativ AI",
    mode: "light",
    type: "area-icon",
    category: "ai",
  },
  {
    name: "light-area-ai-02",
    label: "Generativ AI",
    mode: "dark",
    type: "area-icon",
    category: "ai",
  },
  {
    name: "light-area-ai-03",
    label: "Generativ AI",
    mode: "dark",
    type: "area-icon",
    category: "ai",
  },
] as const satisfies IllustrationMeta[];

export type IllustrationName = (typeof ILLUSTRATIONS)[number]["name"];
export type IllustrationMode = (typeof ILLUSTRATIONS)[number]["mode"];
export type IllustrationType = (typeof ILLUSTRATIONS)[number]["type"];

export const getIllustration = (name: IllustrationName) =>
  ILLUSTRATIONS.find((i) => i.name === name);
