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

// Track SPA navigations as GA page_view events (initial load is sent by gtag config).
router.subscribe("onResolved", ({ toLocation }) => {
  window.gtag?.("event", "page_view", {
    page_path: toLocation.pathname,
    page_location: window.location.href,
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
