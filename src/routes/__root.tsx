import { Toaster } from "sonner";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import "@/globals.css";

import { RootError } from "@/routes/-root-error";
import { RootNotFound } from "@/routes/-root-not-found";

import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { I18nProvider } from "@/provider/i18n-provider";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: RootNotFound,
  errorComponent: RootError,
});

function RootComponent() {
  return (
    <I18nProvider>
      <div className="flex h-dvh flex-col">
        <Navbar />
        <main className="container flex min-h-0 flex-1 bg-background">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster expand={false} closeButton position="top-center" />
    </I18nProvider>
  );
}
