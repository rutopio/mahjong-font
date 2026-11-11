import tilesData from "../../src/data/tiles-data.json";
import { decodeImageTilePath } from "../../src/lib/image-input";
import { renderBadgeSvg } from "../../src/lib/render-badge-svg";
import type { TilesData } from "../../src/lib/tiles-data";
import { decodeFromQuery } from "../../src/lib/url-state";

const data = tilesData as unknown as TilesData;

export const onRequestGet: PagesFunction = async (context) => {
  const { request, params } = context;
  const url = new URL(request.url);

  const raw = params.tile;
  const tile = decodeImageTilePath((Array.isArray(raw) ? raw[0] : raw) ?? "");
  if (tile === null) {
    return new Response("Invalid tile path", { status: 400 });
  }
  const state = decodeFromQuery(url.search, tile);
  const cache = await caches.open("mahjong-images");
  const cached = await cache.match(request);
  if (cached) return cached;

  const svg = renderBadgeSvg({
    text: state.input,
    theme: state.theme,
    tileColor: state.tileColor,
    data,
  });

  if (!svg) {
    return new Response("No tiles to render", { status: 400 });
  }

  const response = new Response(svg, {
    headers: {
      "content-type": "image/svg+xml;charset=utf-8",
      "content-security-policy": "sandbox",
      "x-content-type-options": "nosniff",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
  context.waitUntil(cache.put(request, response.clone()));
  return response;
};

export const config = { runtime: "edge" };
