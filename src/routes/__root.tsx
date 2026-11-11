import { BreakpointIndicator } from "@rutopio/ui/breakpoint-indicator";
import { PageTransition } from "@rutopio/ui/page-transition";
import { SiteLayout } from "@rutopio/ui/site-layout";
import { Toaster } from "@rutopio/ui/sonner";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import "@/styles/globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { NotFound } from "@/components/not-found";
import { useLang } from "@/hooks/use-lang";
import i18n from "@/lib/i18n";
import { stripLocale } from "@/lib/locale";
import { I18nProvider } from "@/provider/i18n-provider";
import { RootError } from "@/routes/-root-error";

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
  notFoundComponent: NotFound,
  errorComponent: RootError,
});

// Keep i18next in sync with the URL (the source of truth for language).
// changeLanguage runs synchronously during render so children read the right
// strings on first paint; the router updates <html lang> with other metadata.
// The app subtree is keyed by lang so every consumer re-renders on switch.
function useLangSync() {
  const lang = useLang();
  if (i18n.language !== lang) i18n.changeLanguage(lang);
  return lang;
}

// Match intd's soft fade on pathname changes. Query and hash updates do not
// remount the page, and reduced-motion preferences skip the entrance fade.
function AnimatedOutlet() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isHome = stripLocale(pathname) === "/";
  return (
    <PageTransition key={pathname}>
      <div
        className={
          isHome
            ? "flex min-w-0 flex-auto flex-col lg:w-[calc(100vw-3rem)] lg:max-w-5xl lg:self-center"
            : "flex min-w-0 flex-auto flex-col"
        }
      >
        <Outlet />
      </div>
    </PageTransition>
  );
}

function RootComponent() {
  const lang = useLangSync();
  return (
    <I18nProvider>
      <SiteLayout key={lang}>
        <a
          href="#main-content"
          className="focus:bg-background focus:outline-ring sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:outline-2"
        >
          {SKIP_LABEL[lang]}
        </a>
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="bg-background flex min-w-0 flex-1 justify-center"
        >
          <AnimatedOutlet />
        </main>
        <Footer />
      </SiteLayout>
      <Toaster expand={false} closeButton position="top-center" />
      {import.meta.env.DEV && <BreakpointIndicator />}
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </I18nProvider>
  );
}
