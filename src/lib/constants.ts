// ============================================================================
// URLs
// ============================================================================

/** GitHub profile URL for the project author. */
export const GITHUB_PROFILE_URL = "https://github.com/rutopio";

/** GitHub repository URL for this project. */
export const GITHUB_REPO_URL = `${GITHUB_PROFILE_URL}/Japanese-Mahjong-Font-with-OpenType`;

/** Base URL for downloading font files from the repository. */
const FONT_DOWNLOAD_BASE_URL =
  "https://raw.githubusercontent.com/rutopio/Japanese-Mahjong-Font-with-OpenType/main/fonts/otf";

// ============================================================================
// Internationalization
// ============================================================================

/** Language option for the language selector. */
interface LanguageOption {
  /** Language code (e.g., "ja", "en"). */
  value: string;
  /** Display label in native language. */
  label: string;
}

/** Available languages for the application. */
export const languages: LanguageOption[] = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "zh-CN", label: "简体中文" },
];

// ============================================================================
// Font Downloads
// ============================================================================

/** Font download option with translation key and URL. */
interface FontDownload {
  /** i18n key for the font label. */
  labelKey: string;
  /** Direct download URL for the font file. */
  url: string;
}

/** Available font files for download. */
export const fontDownloads: FontDownload[] = [
  {
    labelKey: "ui.monochromeFont",
    url: `${FONT_DOWNLOAD_BASE_URL}/Riichi-Mahjong-Monochrome.otf`,
  },
  {
    labelKey: "ui.colorfulFont",
    url: `${FONT_DOWNLOAD_BASE_URL}/Riichi-Mahjong-Colorful.otf`,
  },
];

// ============================================================================
// Yaku (Winning Hands) Examples
// ============================================================================

/**
 * Single source of truth for yaku examples, grouped by han value.
 * Each group's `han` drives both the group label key (`groups.<han>`) and
 * each item's i18n key (`yaku.<han>.<name>`). `optionValues` and `yakuGroups`
 * below are derived from this, so a new yaku is added in exactly one place.
 */
const yakuSource: {
  han: string;
  items: { name: string; notation: string }[];
}[] = [
  {
    han: "one_han",
    items: [
      { name: "tanyao", notation: "777m234888p4568s_8s" },
      { name: "ipeiko", notation: "334455s55m5m*123p3z_3z" },
      { name: "pinfu", notation: "45678p123s34599m_9p" },
    ],
  },
  {
    han: "two_han",
    items: [
      { name: "sanshoku_doujun", notation: "7z123m123p123s678m_7z" },
      { name: "sanshoku_douko", notation: "666m666p66s789s99m_6s" },
      { name: "sankantsu", notation: "567s99m_0880m 222p-2p= 3s-333s" },
      { name: "shosangen", notation: "77666555z678s88m_8m" },
      { name: "ikki_tsuukan", notation: "234m123456789s7z_7z" },
      { name: "chanta", notation: "99123m123999p77z_9m" },
      { name: "toitoi", notation: "444m222s7z_4z4z-4z 99m-9m_7z" },
      { name: "sananko", notation: "111m111p444p34s11z_5s*" },
      { name: "chitoi", notation: "11m44m88m99m44p22s4z_4z" },
      { name: "honro", notation: "666z222z999s1m_1p-11p_1m" },
    ],
  },
  {
    han: "three_han",
    items: [
      { name: "honiso", notation: "11222567p22233z_1p" },
      { name: "jyunchan", notation: "1112378p123999s_9p" },
      { name: "ryopee", notation: "223344s667788p6z_6z" },
    ],
  },
  {
    han: "six_han",
    items: [{ name: "chiniso", notation: "2344466777999m_1m" }],
  },
  {
    han: "yakuman",
    items: [
      { name: "kokushi", notation: "19m19p19s1234567z_1m" },
      { name: "chulen", notation: "1112345678999m_2m" },
      { name: "suanko", notation: "111m111p444p333s1z_1z" },
      { name: "suukantsu", notation: "44s_2m-22m2m 222p2p- 22s2s-2s 555z5z-" },
      { name: "daisangen", notation: "555666777z678s5m_5m*" },
      { name: "daishushi", notation: "11122233344z22s_4z" },
      { name: "syoushushi", notation: "1112223344z333s_3z" },
      { name: "tsuiso", notation: "1133344477755z_5z" },
      { name: "ryuiso", notation: "22234666888s66z_2s" },
      { name: "chinroo", notation: "1119m111999p999s_9m" },
    ],
  },
  {
    han: "others",
    items: [{ name: "dice", notation: "1.2.3.4.5.6." }],
  },
];

/**
 * Mapping of yaku i18n keys to their mahjong notation strings.
 * Used to resolve a selected option back to its notation.
 */
export const optionValues: Record<string, string> = Object.fromEntries(
  yakuSource.flatMap((group) =>
    group.items.map((item) => [`yaku.${group.han}.${item.name}`, item.notation])
  )
);

/** Yaku group for categorizing hands by han value. */
interface YakuGroup {
  /** i18n key for the group label (e.g., "groups.one_han"). */
  labelKey: string;
  /** Array of yaku i18n keys belonging to this group. */
  items: string[];
}

/** Yaku hands grouped by their han (scoring) value, derived from yakuSource. */
export const yakuGroups: YakuGroup[] = yakuSource.map((group) => ({
  labelKey: `groups.${group.han}`,
  items: group.items.map((item) => `yaku.${group.han}.${item.name}`),
}));

// ============================================================================
// Theme Options
// ============================================================================

/** Theme option for the font style selector. */
interface ThemeOption {
  /** Internal value for the theme. */
  value: string;
  /** i18n key for the theme label. */
  labelKey: string;
}

/** Available font themes (monochrome or colorful). */
export const themeOptions: ThemeOption[] = [
  { value: "monochrome", labelKey: "ui.monochrome" },
  { value: "colorful", labelKey: "ui.colorful" },
];

// ============================================================================
// Notation Examples & Documentation
// ============================================================================

/** Example notation for demonstration purposes. */
interface NotationExample {
  /** i18n key for the combination description. */
  combination: string;
  /** Mahjong notation string to display. */
  notation: string;
}

/** Examples showing various notation combinations. */
export const notationExamples: NotationExample[] = [
  { combination: "notation.manzu-examples", notation: "1m2m3m" },
  { combination: "notation.pinzu-aka-dora-examples", notation: "4p5p*6p" },
  { combination: "notation.souzu-fuuro-examples", notation: "6s7s-8s" },
  { combination: "notation.zipai-ka-kan-examples", notation: "1z1z1z-1z=" },
  { combination: "notation.zipai-an-kan-examples", notation: "0z7z7z0z" },
  { combination: "notation.big-gap-examples", notation: "1m2m3m5s5s*_5s" },
  { combination: "notation.dice-examples", notation: "1.2.3.4.5.6." },
];

/**
 * Union type for different notation item display formats.
 * - "range": Shows a range of tiles (e.g., 1m to 9m)
 * - "badges": Shows badge items with a description
 * - "badges-wrapped": Shows badges wrapped between two descriptions
 * - "description": Shows a title with description text
 */
export type NotationItem =
  | {
      type: "range";
      titleKey: string;
      start: string;
      end: string;
      suffix?: string;
    }
  | {
      type: "badges";
      titleKey: string;
      descriptionKey: string;
      badges: string[];
    }
  | {
      type: "badges-wrapped";
      titleKey: string;
      descriptionKey1: string;
      badges: string[];
      descriptionKey2: string;
    }
  | { type: "description"; titleKey: string; descriptionKey: string };

/** Notation items for the "How to Use" documentation modal. */
export const notationItems: NotationItem[] = [
  { type: "range", titleKey: "notation.manzu", start: "1m", end: "9m" },
  { type: "range", titleKey: "notation.pinzu", start: "1p", end: "9p" },
  { type: "range", titleKey: "notation.souzu", start: "1s", end: "9s" },
  {
    type: "range",
    titleKey: "notation.zipai",
    start: "1z",
    end: "7z",
    suffix: "（東南西北白発中）",
  },
  { type: "range", titleKey: "notation.dice", start: "1.", end: "6." },
  {
    type: "badges",
    titleKey: "notation.aka-dora",
    descriptionKey: "notation.explainOfAkaDora",
    badges: ["5m*", "5p*", "5s*"],
  },
  {
    type: "badges",
    titleKey: "notation.fuuro",
    descriptionKey: "notation.explainOfFuuro",
    badges: ["4m-", "6s-", "7z-"],
  },
  {
    type: "badges",
    titleKey: "notation.ka-kan",
    descriptionKey: "notation.explainOfKaKan",
    badges: ["2m=", "5s=", "1z="],
  },
  {
    type: "badges-wrapped",
    titleKey: "notation.an-kan",
    descriptionKey1: "notation.explainOfAnKan1",
    badges: ["0m", "0p", "0s", "0z"],
    descriptionKey2: "notation.explainOfAnKan2",
  },
  {
    type: "description",
    titleKey: "notation.space",
    descriptionKey: "notation.explainOfSpace",
  },
  {
    type: "description",
    titleKey: "notation.big-gap",
    descriptionKey: "notation.explainOfBigGap",
  },
];

// ============================================================================
// Color Picker
// ============================================================================

/** Default tile color for the colorful font theme. */
export const DEFAULT_TILE_COLOR = "#AA7942";

/** Preset colors for the color swatch picker. */
export const PRESET_COLORS = [
  "#AA7942",
  "#0a22c0",
  "#409034",
  "#d4b83d",
  "#ba271a",
  "#51b2f8",
  "#c794e0",
  "#701c31",
  "#edbdde",
  "#c2d7cb",
  "#000000",
];
