/**
 * Builds an Open Graph image SVG (1.91:1) for a mahjong tile sequence: a white
 * canvas with the tile group scaled to fit and centered, surrounded by padding.
 * Platform-agnostic and pure, so it is reused by the Cloudflare Pages function
 * that rasterizes it to PNG on demand.
 */

import { buildTilesContent } from "./render-tile-svg";
import type { TilesData } from "./tiles-data";

/** Open Graph recommended 1.91:1 canvas. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** White border around the tiles, in OG pixels. */
const OG_PADDING = 80;

const BG_COLOR = "#ffffff";

interface OgOptions {
  text: string;
  theme: string;
  tileColor: string;
  data: TilesData;
}

/**
 * Returns an OG image as an SVG string, or null when there are no tiles to
 * render (caller can fall back to a static image).
 */
export function renderOgSvg({
  text,
  theme,
  tileColor,
  data,
}: OgOptions): string | null {
  const content = buildTilesContent({ text, theme, tileColor, data });
  if (!content) return null;

  const { inner, width, height } = content;

  // Fit the tile box into the padded area, preserving aspect ratio.
  const boxW = OG_WIDTH - OG_PADDING * 2;
  const boxH = OG_HEIGHT - OG_PADDING * 2;
  const scale = Math.min(boxW / width, boxH / height);

  const scaledW = width * scale;
  const scaledH = height * scale;
  const tx = (OG_WIDTH - scaledW) / 2;
  const ty = (OG_HEIGHT - scaledH) / 2;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${OG_WIDTH}" height="${OG_HEIGHT}" ` +
    `viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">` +
    `<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${BG_COLOR}"/>` +
    `<g transform="translate(${tx} ${ty}) scale(${scale})">${inner}</g>` +
    `</svg>`
  );
}
