import { NOT_FOUND_TITLE } from "@rutopio/ui/not-found";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  HREFLANG,
  imageAltFor,
  LANGS,
  metaFor,
  OG_LOCALE,
  pathFor,
  resolveRoute,
} from "../functions/seo-meta";
import { isValidImageTile } from "./lib/image-input";
import { localeByCode } from "./lib/locale";
import { decodeFromQuery, encodeToQuery } from "./lib/url-state";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

function syncMetadata(pathname: string) {
  const route = resolveRoute(pathname);
  const { title, description } = metaFor(route);
  document.documentElement.lang = localeByCode(route.lang).htmlLang;
  const origin = window.location.origin;
  const canonical = `${origin}${route.path}`;
  const state = decodeFromQuery(
    route.page === "home" ? window.location.search : ""
  );
  const imageState = isValidImageTile(state.input)
    ? state
    : decodeFromQuery("");
  const image = `${origin}/og?${encodeToQuery(imageState)}`;
  const imageAlt = imageAltFor(route.lang, imageState.input);
  const pageUrl =
    route.page === "home" && window.location.search
      ? `${canonical}?${encodeToQuery(state)}`
      : canonical;
  const setContent = (selector: string, value: string) => {
    document
      .querySelector<HTMLMetaElement>(selector)
      ?.setAttribute("content", value);
  };
  const setHref = (selector: string, value: string) => {
    document
      .querySelector<HTMLLinkElement>(selector)
      ?.setAttribute("href", value);
  };

  document.title = router.state.matches.some(
    (match) => match.status === "notFound" || match._notFound
  )
    ? NOT_FOUND_TITLE
    : title;
  setContent('meta[name="description"]', description);
  setHref('link[rel="canonical"]', canonical);
  for (const lang of LANGS) {
    setHref(
      `link[hreflang="${HREFLANG[lang]}"]`,
      `${origin}${pathFor(lang, route.page)}`
    );
  }
  setHref(
    'link[hreflang="x-default"]',
    `${origin}${pathFor("ja", route.page)}`
  );
  for (const key of ["title", "description", "image"] as const) {
    const value =
      key === "title" ? title : key === "description" ? description : image;
    setContent(`meta[property="og:${key}"]`, value);
    setContent(`meta[name="twitter:${key}"]`, value);
  }
  setContent('meta[property="og:url"]', pageUrl);
  setContent('meta[property="og:locale"]', OG_LOCALE[route.lang]);
  setContent('meta[property="og:image:alt"]', imageAlt);
  setContent('meta[name="twitter:image:alt"]', imageAlt);
}

syncMetadata(window.location.pathname);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Track the initial load and SPA navigations; gtag config disables automatic page views.
router.subscribe("onResolved", ({ fromLocation, toLocation }) => {
  syncMetadata(toLocation.pathname);
  if (fromLocation && fromLocation.pathname !== toLocation.pathname) {
    requestAnimationFrame(() =>
      document.getElementById("main-content")?.focus({ preventScroll: true })
    );
  }
  window.gtag?.("event", "page_view", {
    page_path: toLocation.pathname,
    page_location: window.location.href,
    page_referrer: fromLocation
      ? new URL(fromLocation.href, window.location.origin).href
      : document.referrer,
  });
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element with id "root" not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
