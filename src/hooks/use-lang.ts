import { useLocation } from "@tanstack/react-router";

import { type Locale, localeForPath } from "@/lib/locale";

// Active locale derived from the URL path (the single source of truth). Bare
// path = ja; /en, /zh_tw, /zh_cn map to their locales. Recomputes on every
// navigation via useLocation.
export function useLang(): Locale {
  const pathname = useLocation({ select: (l) => l.pathname });
  return localeForPath(pathname).code;
}
