// URLs
export const GITHUB_PROFILE_URL = "https://github.com/rutopio";
export const GITHUB_REPO_URL =
  "https://github.com/rutopio/Japanese-Mahjong-Font-with-OpenType";
export const FONT_DOWNLOAD_BASE_URL =
  "https://raw.githubusercontent.com/rutopio/Japanese-Mahjong-Font-with-OpenType/main/public/fonts";

// Languages
export const languages = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "zh-CN", label: "简体中文" },
];

// Font downloads
export const fontDownloads = [
  {
    labelKey: "monochromeFont",
    url: `${FONT_DOWNLOAD_BASE_URL}/Riichi-Mahjong-Mono.otf`,
  },
  {
    labelKey: "colorfulFont",
    url: `${FONT_DOWNLOAD_BASE_URL}/Riichi-Mahjong-Color.otf`,
  },
];

// Yaku option values
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

export const yakuGroups = [
  { labelKey: "one_han", items: ["tanyao", "ipeiko", "pinfu"] },
  { labelKey: "two_han", items: ["sanshoku_doujun", "sanshoku_douko", "sankantsu", "shosangen", "ikki_tsuukan", "chanta", "toitoi", "sananko", "chitoi", "honro"] },
  { labelKey: "three_han", items: ["honiso", "jyunchan", "ryopee"] },
  { labelKey: "six_han", items: ["chiniso"] },
  { labelKey: "yakuman", items: ["kokushi", "chulen", "suanko", "suukantsu", "daisangen", "daishushi", "syoushushi", "tsuiso", "ryuiso", "chinroo"] },
];

export const themeOptions = [
  { value: "monochrome", labelKey: "monochrome" },
  { value: "colorful", labelKey: "colorful" },
];

export const notationExamples = [
  { combination: "manzu-examples", notation: "1m2m3m" },
  { combination: "pinzu-aka-dora-examples", notation: "4p5p*6p" },
  { combination: "souzu-fuuro-examples", notation: "6s7s-8s" },
  { combination: "zipai-ka-kan-examples", notation: "1z1z1z-1z=" },
  { combination: "zipai-an-kan-examples", notation: "0z7z7z0z" },
  { combination: "big-gap-examples", notation: "1m2m3m5s5s*_5s" },
];

export type NotationItem =
  | { type: "range"; titleKey: string; start: string; end: string; suffix?: string }
  | { type: "badges"; titleKey: string; descriptionKey: string; badges: string[] }
  | { type: "badges-wrapped"; titleKey: string; descriptionKey1: string; badges: string[]; descriptionKey2: string }
  | { type: "description"; titleKey: string; descriptionKey: string };

export const notationItems: NotationItem[] = [
  { type: "range", titleKey: "manzu", start: "1m", end: "9m" },
  { type: "range", titleKey: "pinzu", start: "1p", end: "9p" },
  { type: "range", titleKey: "souzu", start: "1s", end: "9s" },
  { type: "range", titleKey: "zipai", start: "1z", end: "7z", suffix: "（東南西北白発中）" },
  { type: "range", titleKey: "dice", start: "1.", end: "6." },
  { type: "badges", titleKey: "aka-dora", descriptionKey: "explainOfAkaDora", badges: ["5m*", "5p*", "5s*"] },
  { type: "badges", titleKey: "fuuro", descriptionKey: "explainOfFuuro", badges: ["4m-", "6s-", "7z-"] },
  { type: "badges", titleKey: "ka-kan", descriptionKey: "explainOfKaKan", badges: ["2m=", "5s=", "1z="] },
  { type: "badges-wrapped", titleKey: "an-kan", descriptionKey1: "explainOfAnKan1", badges: ["0m", "0p", "0s", "0z"], descriptionKey2: "explainOfAnKan2" },
  { type: "description", titleKey: "space", descriptionKey: "explainOfSpace" },
  { type: "description", titleKey: "big-gap", descriptionKey: "explainOfBigGap" },
];
