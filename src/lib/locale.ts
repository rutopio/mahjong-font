// Language codes use BCP-47 casing; URL prefixes use lowercase underscores.

export type Locale = "ja" | "en" | "zh-TW" | "zh-CN";

export interface LocaleMeta {
  /** i18next language code (matches the resources keys in lib/i18n.ts) */
  code: Locale;
  /** Empty for the default locale. */
  prefix: string;
  htmlLang: string;
  label: string;
  default?: boolean;
}

const LOCALES: [LocaleMeta, ...LocaleMeta[]] = [
  { code: "ja", prefix: "", htmlLang: "ja", label: "日本語", default: true },
  { code: "en", prefix: "/en", htmlLang: "en", label: "English" },
  { code: "zh-TW", prefix: "/zh_tw", htmlLang: "zh-Hant", label: "繁體中文" },
  { code: "zh-CN", prefix: "/zh_cn", htmlLang: "zh-Hans", label: "简体中文" },
];

const DEFAULT_LOCALE: LocaleMeta = LOCALES[0];

// Longer prefixes take precedence over nested locale prefixes.
const PREFIXED_LOCALES = LOCALES.filter((l) => !l.default).sort(
  (a, b) => b.prefix.length - a.prefix.length
);

export function localeByCode(code: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? DEFAULT_LOCALE;
}

export function localeForPath(pathname: string): LocaleMeta {
  for (const l of PREFIXED_LOCALES) {
    if (pathname === l.prefix || pathname.startsWith(`${l.prefix}/`)) return l;
  }
  return DEFAULT_LOCALE;
}

export function stripLocale(pathname: string): string {
  const l = localeForPath(pathname);
  if (l.default) return pathname;
  const rest = pathname.slice(l.prefix.length);
  return rest === "" ? "/" : rest;
}

export function withLocale(pathname: string, code: Locale): string {
  const bare = stripLocale(pathname);
  const target = localeByCode(code);
  if (target.default) return bare;
  return bare === "/" ? target.prefix : `${target.prefix}${bare}`;
}
