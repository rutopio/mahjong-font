/**
 * Cloudflare Pages Function: on-demand tile badge, shields.io style.
 *
 *   GET /img/<tile>?theme=color&color=AA7942
 *
 * The tile sequence comes from the URL path; theme/color come from the query
 * and fall back to defaults when omitted. Returns an inline SVG (like
 * shields.io) sized to the tiles, cached aggressively at the edge.
 */

import { renderBadgeSvg } from "../../src/lib/render-badge-svg";
import type { TilesData } from "../../src/lib/tiles-data";
import tilesData from "../../src/lib/tiles-data.json";
import { decodeFromQuery } from "../../src/lib/url-state";

const data = tilesData as unknown as TilesData;

export const onRequestGet: PagesFunction = ({ request, params }) => {
  const url = new URL(request.url);

  // [tile] is a single path segment; /img (no tile) falls through to the SPA.
  const raw = params.tile;
  const tile = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  const state = decodeFromQuery(url.search, decodeURIComponent(tile));

  const svg = renderBadgeSvg({
    text: state.input,
    theme: state.theme,
    tileColor: state.tileColor,
    data,
  });

  if (!svg) {
    return new Response("No tiles to render", { status: 400 });
  }

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml;charset=utf-8",
      // Pure function of the URL; cache hard at the edge.
      "cache-control": "public, max-age=86400, s-maxage=2592000, immutable",
    },
  });
};

export const config = { runtime: "edge" };
