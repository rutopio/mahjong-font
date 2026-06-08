import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";

import "@/styles/globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScreenSize } from "@/components/layout/screen-size";
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

function RootComponent() {
  return (
    <I18nProvider>
      <div className="flex min-h-dvh flex-col">
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
