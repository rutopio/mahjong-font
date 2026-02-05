// ============================================================================
// URLs
// ============================================================================

/** GitHub profile URL for the project author. */
export const GITHUB_PROFILE_URL = "https://github.com/rutopio";

/** GitHub repository URL for this project. */
export const GITHUB_REPO_URL = `${GITHUB_PROFILE_URL}/Japanese-Mahjong-Font-with-OpenType`;

/** Base URL for downloading font files from the repository. */
export const FONT_DOWNLOAD_BASE_URL =
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
    labelKey: "monochromeFont",
    url: `${FONT_DOWNLOAD_BASE_URL}/Riichi-Mahjong-Monochrome.otf`,
  },
  {
    labelKey: "colorfulFont",
    url: `${FONT_DOWNLOAD_BASE_URL}/Riichi-Mahjong-Colorful.otf`,
  },
];

// ============================================================================
// Yaku (Winning Hands) Examples
// ============================================================================

/**
 * Mapping of yaku names to their mahjong notation strings.
 * Used for the example hand selector dropdown.
 */
export const optionValues: Record<string, string> = {
  tanyao: "777m234888p4568s_8s",
  ipeiko: "334455s55m5m*123p3z_3z",
  pinfu: "45678p123s34599m_9p",
  sanshoku_doujun: "7z123m123p123s678m_7z",
  sanshoku_douko: "666m666p66s789s99m_6s",
  sankantsu: "567s99m_0880m 222p-2p= 3s-333s",
  shosangen: "77666555z678s88m_8m",
  ikki_tsuukan: "234m123456789s7z_7z",
  chanta: "99123m123999p77z_9m",
  toitoi: "444m222s7z_4z4z-4z 99m-9m_7z",
  sananko: "111m111p444p34s11z_5s*",
  chitoi: "11m44m88m99m44p22s4z_4z",
  honro: "666z222z999s1m_1p-11p_1m",
  honiso: "11222567p22233z_1p",
  jyunchan: "1112378p123999s_9p",
  ryopee: "223344s667788p6z_6z",
  chiniso: "2344466777999m_1m",
  kokushi: "19m19p19s1234567z_1m",
  chulen: "1112345678999m_2m",
  suanko: "111m111p444p333s1z_1z",
  suukantsu: "44s_2m-22m2m 222p2p- 22s2s-2s 555z5z-",
  daisangen: "555666777z678s5m_5m*",
  daishushi: "11122233344z22s_4z",
  syoushushi: "1112223344z333s_3z",
  tsuiso: "1133344477755z_5z",
  ryuiso: "22234666888s66z_2s",
  chinroo: "1119m111999p999s_9m",
};

/** Yaku group for categorizing hands by han value. */
interface YakuGroup {
  /** i18n key for the group label (e.g., "one_han", "yakuman"). */
  labelKey: string;
  /** Array of yaku keys belonging to this group. */
  items: string[];
}

/** Yaku hands grouped by their han (scoring) value. */
export const yakuGroups: YakuGroup[] = [
  { labelKey: "one_han", items: ["tanyao", "ipeiko", "pinfu"] },
  {
    labelKey: "two_han",
    items: [
      "sanshoku_doujun",
      "sanshoku_douko",
      "sankantsu",
      "shosangen",
      "ikki_tsuukan",
      "chanta",
      "toitoi",
      "sananko",
      "chitoi",
      "honro",
    ],
  },
  { labelKey: "three_han", items: ["honiso", "jyunchan", "ryopee"] },
  { labelKey: "six_han", items: ["chiniso"] },
  {
    labelKey: "yakuman",
    items: [
      "kokushi",
      "chulen",
      "suanko",
      "suukantsu",
      "daisangen",
      "daishushi",
      "syoushushi",
      "tsuiso",
      "ryuiso",
      "chinroo",
    ],
  },
];

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
  { value: "monochrome", labelKey: "monochrome" },
  { value: "colorful", labelKey: "colorful" },
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
  { combination: "manzu-examples", notation: "1m2m3m" },
  { combination: "pinzu-aka-dora-examples", notation: "4p5p*6p" },
  { combination: "souzu-fuuro-examples", notation: "6s7s-8s" },
  { combination: "zipai-ka-kan-examples", notation: "1z1z1z-1z=" },
  { combination: "zipai-an-kan-examples", notation: "0z7z7z0z" },
  { combination: "big-gap-examples", notation: "1m2m3m5s5s*_5s" },
  { combination: "dice-examples", notation: "1.2.3.4.5.6." },
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
  { type: "range", titleKey: "manzu", start: "1m", end: "9m" },
  { type: "range", titleKey: "pinzu", start: "1p", end: "9p" },
  { type: "range", titleKey: "souzu", start: "1s", end: "9s" },
  {
    type: "range",
    titleKey: "zipai",
    start: "1z",
    end: "7z",
    suffix: "（東南西北白発中）",
  },
  { type: "range", titleKey: "dice", start: "1.", end: "6." },
  {
    type: "badges",
    titleKey: "aka-dora",
    descriptionKey: "explainOfAkaDora",
    badges: ["5m*", "5p*", "5s*"],
  },
  {
    type: "badges",
    titleKey: "fuuro",
    descriptionKey: "explainOfFuuro",
    badges: ["4m-", "6s-", "7z-"],
  },
  {
    type: "badges",
    titleKey: "ka-kan",
    descriptionKey: "explainOfKaKan",
    badges: ["2m=", "5s=", "1z="],
  },
  {
    type: "badges-wrapped",
    titleKey: "an-kan",
    descriptionKey1: "explainOfAnKan1",
    badges: ["0m", "0p", "0s", "0z"],
    descriptionKey2: "explainOfAnKan2",
  },
  { type: "description", titleKey: "space", descriptionKey: "explainOfSpace" },
  {
    type: "description",
    titleKey: "big-gap",
    descriptionKey: "explainOfBigGap",
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
