const TRAILING_SLASHES_RE = /\/+$/;
/**
 * Per-route SEO metadata for the title/description/locale/hreflang rewrite in
 * _middleware.ts. The app is a single index.html shell, so the static head only
 * describes the ja home page. Crawlers don't run JS, so the middleware injects
 * the right title / description / canonical / locale / hreflang per route from
 * here. Pure data, no app imports, so it stays out of the client bundle.
 *
 * Mirrors src/lib/locale.ts (ja default at bare path; en /en, zh-TW /zh_tw,
 * zh-CN /zh_cn) but lives under functions/ so the edge has no src dependency.
 */

export type Lang = "ja" | "en" | "zh-TW" | "zh-CN";
export type Page = "home" | "api" | "about";

export interface RouteMeta {
  lang: Lang;
  page: Page;
  /** Canonical path (no origin), e.g. "/" or "/en/api". */
  path: string;
}

interface Copy {
  title: string;
  description: string;
}

// Title/description per (lang, page). Home keeps the existing index.html values
// for ja/en; zh variants follow the locale json tone. api descriptions come from
// imgApi.intro in src/locale/*.json.
const COPY: Record<Lang, Record<Page, Copy>> = {
  ja: {
    home: {
      title: "麻雀牌図作成ツール | Mahjong Tile Image Generator",
      description:
        "牌譜から美しい麻雀牌の画像を作成。モノクロとカラーのテーマに対応し、OpenType 機能付きフォントで描画します。",
    },
    api: {
      title: "Image API | 麻雀牌図作成ツール",
      description:
        "牌譜を URL のパスに入れるだけで、そのまま埋め込める SVG 画像が得られます。配色テーマと色の省略時は既定値が適用されます。",
    },
    about: {
      title: "このツールについて | 麻雀牌図作成ツール",
      description:
        "Mahjong Font は、牌譜の文字列からカラーまたは白黒の麻雀牌図を作成できるツールです。",
    },
  },
  en: {
    home: {
      title: "Mahjong Tile Image Generator",
      description:
        "Create beautiful mahjong tile images with customizable notation. Supports monochrome and colorful themes.",
    },
    api: {
      title: "Image API | Mahjong Tile Image Generator",
      description:
        "Put a tile string in the URL path to get an SVG image you can embed directly. Omitted theme and color parameters use their defaults.",
    },
    about: {
      title: "About | Mahjong Tile Image Generator",
      description:
        "Mahjong Font creates color and monochrome mahjong tile diagrams from notation strings.",
    },
  },
  "zh-TW": {
    home: {
      title: "麻將牌圖產生器 | Mahjong Tile Image Generator",
      description:
        "用牌譜製作精美的麻將牌圖。支援單色與彩色主題，以 OpenType 機能字型描繪。",
    },
    api: {
      title: "Image API | 麻將牌圖產生器",
      description:
        "把牌譜放進網址路徑就能得到一張可直接內嵌的 SVG 圖片。配色主題與顏色省略時會套用預設值。",
    },
    about: {
      title: "關於 | 麻將牌圖產生器",
      description: "Mahjong Font 能用牌譜文字製作彩色或黑白麻將牌圖。",
    },
  },
  "zh-CN": {
    home: {
      title: "麻将牌图生成器 | Mahjong Tile Image Generator",
      description:
        "用牌谱制作精美的麻将牌图。支持单色与彩色主题，以 OpenType 机能字体描绘。",
    },
    api: {
      title: "Image API | 麻将牌图生成器",
      description:
        "把牌谱放进网址路径就能得到一张可直接内嵌的 SVG 图片。配色主题与颜色省略时会套用默认值。",
    },
    about: {
      title: "关于 | 麻将牌图生成器",
      description: "Mahjong Font 能用牌谱文字制作彩色或黑白麻将牌图。",
    },
  },
};

/** og:locale code per language. */
export const OG_LOCALE: Record<Lang, string> = {
  ja: "ja_JP",
  en: "en_US",
  "zh-TW": "zh_TW",
  "zh-CN": "zh_CN",
};

/** <html lang> / hreflang code per language. */
export const HREFLANG: Record<Lang, string> = {
  ja: "ja",
  en: "en",
  "zh-TW": "zh-Hant",
  "zh-CN": "zh-Hans",
};

const IMAGE_ALT: Record<Lang, string> = {
  ja: "麻雀牌の画像、牌譜：",
  en: "Mahjong tile diagram, notation: ",
  "zh-TW": "麻雀牌圖，牌譜：",
  "zh-CN": "麻将牌图，牌谱：",
};

export function imageAltFor(lang: Lang, tile: string): string {
  return `${IMAGE_ALT[lang]}${tile}`;
}

/** URL prefix per language (ja is bare). */
const PREFIX: Record<Lang, string> = {
  ja: "",
  en: "/en",
  "zh-TW": "/zh_tw",
  "zh-CN": "/zh_cn",
};

export const LANGS: Lang[] = ["ja", "en", "zh-TW", "zh-CN"];

/** Canonical path for a page in a given language. ja is bare, others prefixed. */
export function pathFor(lang: Lang, page: Page): string {
  const base = page === "home" ? "/" : `/${page}`;
  const prefix = PREFIX[lang];
  if (!prefix) return base;
  return page === "home" ? prefix : `${prefix}${base}`;
}

/** Resolve a URL pathname to its language, page, and canonical path. */
export function resolveRoute(pathname: string): RouteMeta {
  // Strip trailing slash (except root) for stable matching.
  const p =
    pathname.length > 1 ? pathname.replace(TRAILING_SLASHES_RE, "") : pathname;
  let lang: Lang = "ja";
  let bare = p;
  for (const l of LANGS) {
    const prefix = PREFIX[l];
    if (prefix && (p === prefix || p.startsWith(`${prefix}/`))) {
      lang = l;
      bare = p.slice(prefix.length) || "/";
      break;
    }
  }
  const page: Page =
    bare === "/api" ? "api" : bare === "/about" ? "about" : "home";
  return { lang, page, path: pathFor(lang, page) };
}

/** Title and description for a resolved route. */
export function metaFor(route: RouteMeta): Copy {
  return COPY[route.lang][route.page];
}
