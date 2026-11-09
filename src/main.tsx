import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Track the initial load and SPA navigations; gtag config disables automatic page views.
router.subscribe("onResolved", ({ fromLocation, toLocation }) => {
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
