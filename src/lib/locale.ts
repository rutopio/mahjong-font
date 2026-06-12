// Single source of truth for locale <-> URL mapping. The URL is the source of
// truth for the active language (no localStorage). Japanese is the default and
// lives at the bare path; other locales get a path prefix. Pure data + pure
// functions, no React, so route shells and the language switch can share it.
//
// Note: the i18next resource keys use BCP-47 casing ("zh-TW"), while the URL
// prefixes use lowercase-underscore ("/zh_tw") to read cleanly in a path.

export type Locale = "ja" | "en" | "zh-TW" | "zh-CN";

export interface LocaleMeta {
  /** i18next language code (matches the resources keys in lib/i18n.ts) */
  code: Locale;
  /** URL prefix. "" for the default locale (no prefix), "/en", "/zh_tw", … */
  prefix: string;
  /** <html lang> value */
  htmlLang: string;
  /** label shown in the language switcher (native name) */
  label: string;
  /** the prefix-less default locale */
  default?: boolean;
}

export const LOCALES: LocaleMeta[] = [
  { code: "ja", prefix: "", htmlLang: "ja", label: "日本語", default: true },
  { code: "en", prefix: "/en", htmlLang: "en", label: "English" },
  { code: "zh-TW", prefix: "/zh_tw", htmlLang: "zh-Hant", label: "繁體中文" },
  { code: "zh-CN", prefix: "/zh_cn", htmlLang: "zh-Hans", label: "简体中文" },
];

export const DEFAULT_LOCALE: LocaleMeta = LOCALES[0];

/** Prefixed locales, longest prefix first (so /zh_tw matches before ""). */
const PREFIXED_LOCALES = LOCALES.filter((l) => !l.default).sort(
  (a, b) => b.prefix.length - a.prefix.length
);

export function localeByCode(code: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? DEFAULT_LOCALE;
}

/** Which locale a pathname belongs to (default locale when no prefix matches). */
export function localeForPath(pathname: string): LocaleMeta {
  for (const l of PREFIXED_LOCALES) {
    if (pathname === l.prefix || pathname.startsWith(`${l.prefix}/`)) return l;
  }
  return DEFAULT_LOCALE;
}

/** Strip any locale prefix, returning the bare path ("/en/api" -> "/api"). */
export function stripLocale(pathname: string): string {
  const l = localeForPath(pathname);
  if (l.default) return pathname;
  const rest = pathname.slice(l.prefix.length);
  return rest === "" ? "/" : rest;
}

/** Rewrite a path to the target locale ("/api" + en -> "/en/api"). */
export function withLocale(pathname: string, code: Locale): string {
  const bare = stripLocale(pathname);
  const target = localeByCode(code);
  if (target.default) return bare;
  return bare === "/" ? target.prefix : `${target.prefix}${bare}`;
}
