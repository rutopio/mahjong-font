import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";

import "@/styles/globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScreenSize } from "@/components/layout/screen-size";
import { useLang } from "@/hooks/use-lang";
import i18n from "@/lib/i18n";
import { localeByCode, stripLocale } from "@/lib/locale";
import { I18nProvider } from "@/provider/i18n-provider";
import { RootError } from "@/routes/-root-error";
import { RootNotFound } from "@/routes/-root-not-found";

const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      }))
    )
  : () => null;

const SKIP_LABEL = {
  ja: "メインコンテンツへ移動",
  en: "Skip to main content",
  "zh-TW": "跳到主要內容",
  "zh-CN": "跳到主要内容",
} as const;

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: RootNotFound,
  errorComponent: RootError,
});

// Keep i18next and <html lang> in sync with the URL (the source of truth for
// language). changeLanguage runs synchronously during render so children read
// the right strings on first paint; the <html lang> write stays in an effect.
// The app subtree is keyed by lang so every consumer re-renders on switch.
function useLangSync() {
  const lang = useLang();
  if (i18n.language !== lang) i18n.changeLanguage(lang);
  useEffect(() => {
    document.documentElement.lang = localeByCode(lang).htmlLang;
  }, [lang]);
  return lang;
}

// Match intd's soft fade on pathname changes. Query and hash updates do not
// remount the page, and reduced-motion preferences skip the entrance fade.
function AnimatedOutlet() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const reduceMotion = useReducedMotion();
  const isHome = stripLocale(pathname) === "/";

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex min-w-0 flex-auto flex-col ${isHome ? "w-full lg:w-[calc(100vw-3rem)] lg:max-w-5xl lg:flex-none" : "w-full"}`}
    >
      <Outlet />
    </motion.div>
  );
}

function RootComponent() {
  const lang = useLangSync();
  return (
    <I18nProvider>
      <div
        key={lang}
        className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-3 min-[360px]:px-6"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:outline-2 focus:outline-ring"
        >
          {SKIP_LABEL[lang]}
        </a>
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex min-w-0 flex-1 justify-center bg-background"
        >
          <AnimatedOutlet />
        </main>
        <Footer />
      </div>
      <Toaster expand={false} closeButton position="top-center" />
      <ScreenSize />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </I18nProvider>
  );
}
