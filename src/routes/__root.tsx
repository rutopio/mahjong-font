import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";

import "@/styles/globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScreenSize } from "@/components/layout/screen-size";
import { useLang } from "@/hooks/use-lang";
import i18n from "@/lib/i18n";
import { localeByCode } from "@/lib/locale";
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

function RootComponent() {
  const lang = useLangSync();
  return (
    <I18nProvider>
      <div key={lang} className="flex min-h-full flex-col">
        <Navbar />
        <main className="container flex flex-1 bg-background">
          <Outlet />
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
