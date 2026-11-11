import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import tilesData from "../src/data/tiles-data.json";
import { isValidImageTile } from "../src/lib/image-input";
import { OG_WIDTH, renderOgSvg } from "../src/lib/render-og-image";
import type { TilesData } from "../src/lib/tiles-data";
import { decodeFromQuery } from "../src/lib/url-state";

const data = tilesData as unknown as TilesData;

// Share initialization across concurrent requests; a failed attempt remains retryable.
let wasmReady: Promise<void> | null = null;
function ensureWasm(): Promise<void> {
  if (!wasmReady) {
    wasmReady = initWasm(resvgWasm as WebAssembly.Module).catch((error) => {
      wasmReady = null;
      throw error;
    });
  }
  return wasmReady;
}

export const onRequestGet: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const requestedTile = url.searchParams.get("tile");
  if (requestedTile !== null && !isValidImageTile(requestedTile)) {
    return new Response("Invalid tile string", { status: 400 });
  }
  const state = decodeFromQuery(url.search);
  const cache = await caches.open("mahjong-images");
  const cached = await cache.match(request);
  if (cached) return cached;

  const svg = renderOgSvg({
    text: state.input,
    theme: state.theme,
    tileColor: state.tileColor,
    data,
  });

  if (!svg) {
    return new Response("No tiles to render", { status: 400 });
  }

  await ensureWasm();
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_WIDTH },
  });
  const png = resvg.render().asPng();

  const response = new Response(png.buffer as ArrayBuffer, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
  context.waitUntil(cache.put(request, response.clone()));
  return response;
};

export const config = { runtime: "edge" };
