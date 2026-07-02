import { readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
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

// Injects <link rel="preload"> for the fonts that would otherwise flash on
// first paint (FOUT with font-display: swap). The body/heading fonts come from
// @fontsource and are hashed at build time, so their final paths are only known
// after bundling — this plugin reads them from the emitted assets. Paper Mono
// has a fixed public/ path. Preloading gives these top priority so they usually
// arrive before first paint, making the swap invisible while swap still
// guarantees the custom font is eventually used (unlike `optional`).
// Noto CJK is intentionally NOT preloaded — the files are large and only a
// fallback, so swap is acceptable there.
const PRELOAD_FONT_MATCHERS = [
  /albert-sans-latin-wght-normal.*\.woff2$/,
  /host-grotesk-latin-wght-normal.*\.woff2$/,
];
const PUBLIC_PRELOAD_FONTS = ["/fonts/PaperMono%5Bwght%5D.woff2"];

function fontPreloadPlugin(): Plugin {
  return {
    name: "font-preload",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const hrefs: string[] = [...PUBLIC_PRELOAD_FONTS];
        // In dev there is no bundle; only the fixed public path is preloaded.
        if (ctx.bundle) {
          for (const name of Object.keys(ctx.bundle)) {
            if (
              ctx.bundle[name]?.type === "asset" &&
              PRELOAD_FONT_MATCHERS.some((re) => re.test(name))
            ) {
              hrefs.push(`/${name}`);
            }
          }
        }
        const tags = hrefs
          .map(
            (href) =>
              `    <link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`
          )
          .join("\n");
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
