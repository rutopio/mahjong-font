import { useLocation } from "@tanstack/react-router";

import { type Locale, localeForPath } from "@/lib/locale";

export function useLang(): Locale {
  const pathname = useLocation({ select: (l) => l.pathname });
  return localeForPath(pathname).code;
}
