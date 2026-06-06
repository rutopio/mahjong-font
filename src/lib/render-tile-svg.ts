/**
 * Builds a single inline SVG for a sequence of mahjong tiles, used by both the
 * on-screen preview and the image export (DRY). Resolves COLR layer colors in
 * JS so it does not depend on browser COLR/CPAL support.
 */

import { shapeTiles } from "./shape-tiles";
import type { TilesData } from "./tiles-data";

/** CPAL index the user is allowed to recolor (the tile base). */
const TILE_BASE_INDEX = 3;

/** Default advance for glyphs missing from the advances table. */
const DEFAULT_ADVANCE = 854;

/**
 * Margin (font units) added around the content so tile outlines don't touch the
 * viewBox edge and get clipped when the SVG is scaled to fit.
 */
const MARGIN = 16;

function resolveColor(
  index: number,
  palette: TilesData["palette"],
  tileColor: string
): string {
  if (index === TILE_BASE_INDEX) return tileColor;
  const c = palette[index];
  return c ? `rgb(${c[0]},${c[1]},${c[2]})` : "#000";
}

interface RenderOptions {
  text: string;
  theme: string;
  /** Hex/rgb color overriding the tile base (colorful only). */
  tileColor: string;
  data: TilesData;
}

/**
 * Returns an SVG string laying tiles left-to-right. Font coordinates are y-up,
 * so the whole content is flipped into the SVG y-down space via a transform.
 */
export function renderTilesSvg({
  text,
  theme,
  tileColor,
  data,
}: RenderOptions): string {
  const { palette, ligatures, advances, bounds, colorful, monochrome } = data;
  const isColorful = theme !== "monochrome";

  const glyphs = shapeTiles(text, ligatures);
  if (glyphs.length === 0) return "";

  let x = 0;
  const groups: string[] = [];
  // Track the true visible extent. Tiles overlap, so advance understates the
  // width; the real content box comes from each glyph's bounds at its x offset.
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const name of glyphs) {
    const advance = advances[name] ?? DEFAULT_ADVANCE;
    const [bxMin, byMin, bxMax, byMax] = bounds[name] ?? [0, 0, advance, 0];
    let paths = "";

    if (isColorful) {
      for (const layer of colorful[name] ?? []) {
        const fill = resolveColor(layer.p, palette, tileColor);
        paths += `<path d="${layer.d}" fill="${fill}"/>`;
      }
    } else {
      const d = monochrome[name];
      if (d) paths += `<path d="${d}" fill="#000"/>`;
    }

    groups.push(`<g transform="translate(${x} 0)">${paths}</g>`);

    minX = Math.min(minX, x + bxMin);
    maxX = Math.max(maxX, x + bxMax);
    minY = Math.min(minY, byMin);
    maxY = Math.max(maxY, byMax);
    x += advance;
  }

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const totalWidth = contentWidth + MARGIN * 2;
  const totalHeight = contentHeight + MARGIN * 2;

  // Place content at (MARGIN, MARGIN): shift left by minX, and flip y-up font
  // space to y-down svg space anchored at the content's top (maxY).
  const inner =
    `<g transform="translate(${MARGIN - minX} ${MARGIN + maxY}) scale(1 -1)">` +
    `${groups.join("")}</g>`;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `viewBox="0 0 ${totalWidth} ${totalHeight}" ` +
    `width="${totalWidth}" height="${totalHeight}">${inner}</svg>`
  );
}

export { DEFAULT_ADVANCE };
