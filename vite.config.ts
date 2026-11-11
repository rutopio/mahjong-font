import { readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { decodeImageTilePath } from "./src/lib/image-input";
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

        const rawTile = url.pathname.slice("/img/".length);
        // /img and /img/ (no tile) fall through to the SPA help page.
        if (!rawTile) return next();
        const tile = decodeImageTilePath(rawTile);
        if (tile === null) {
          res.statusCode = 400;
          res.end("Invalid tile path");
          return;
        }
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

// Preload the self-hosted Latin body font and Paper Mono. CJK subsets are
// requested as needed by the browser's unicode-range rules.
const PUBLIC_PRELOAD_FONTS = [
  "/fonts/ui/inter-normal-core.woff2",
  "/fonts/PaperMono%5Bwght%5D.woff2",
];

function fontPreloadPlugin(): Plugin {
  return {
    name: "font-preload",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const tags = PUBLIC_PRELOAD_FONTS.map(
          (href) =>
            `    <link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`
        ).join("\n");
        return html.replace("</head>", `${tags}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [
    imgBadgePlugin(),
    tailwindcss(),
    tanstackRouter(),
    react(),
    fontPreloadPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
