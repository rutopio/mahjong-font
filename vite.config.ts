import { readFileSync } from "node:fs";
import path from "node:path";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { renderBadgeSvg } from "./src/lib/render-badge-svg";
import type { TilesData } from "./src/lib/tiles-data";
import { decodeFromQuery } from "./src/lib/url-state";

/**
 * Dev-only: mirror the /img Pages Function so the badge endpoint works under
 * `vite dev` too (Cloudflare Functions only run under wrangler). Shares the
 * same renderer, so dev and prod stay in sync.
 */
function imgBadgePlugin(): Plugin {
  const data = JSON.parse(
    readFileSync(path.resolve(__dirname, "src/lib/tiles-data.json"), "utf8")
  ) as TilesData;

  return {
    name: "img-badge-dev",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? "", "http://localhost");
        if (!url.pathname.startsWith("/img/")) return next();

        const tile = decodeURIComponent(url.pathname.slice("/img/".length));
        // /img and /img/ (no tile) fall through to the SPA help page.
        if (!tile) return next();
        const state = decodeFromQuery(url.search, tile);
        const svg = renderBadgeSvg({
          text: state.input,
          theme: state.theme,
          tileColor: state.tileColor,
          data,
        });

        if (!svg) {
          res.statusCode = 400;
          res.end("No tiles to render");
          return;
        }
        res.setHeader("content-type", "image/svg+xml;charset=utf-8");
        res.end(svg);
      });
    },
  };
}

export default defineConfig({
  plugins: [imgBadgePlugin(), tanstackRouter(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
