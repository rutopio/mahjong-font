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

/** Tile content as a positioned <g>, plus its total box size in font units. */
export interface TilesContent {
  /** The `<g>` group with all tiles, already flipped to y-down svg space. */
  inner: string;
  width: number;
  height: number;
}

/**
 * Lays tiles left-to-right and returns the inner `<g>` plus its box size. Font
 * coordinates are y-up, so the content is flipped into svg y-down space. Shared
 * by the inline preview and the OG image renderer.
 */
export function buildTilesContent({
  text,
  theme,
  tileColor,
  data,
}: RenderOptions): TilesContent | null {
  const { palette, ligatures, advances, bounds, colorful, monochrome } = data;
  const isColorful = theme !== "monochrome";

  const glyphs = shapeTiles(text, ligatures);
  if (glyphs.length === 0) return null;

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

  const width = maxX - minX + MARGIN * 2;
  const height = maxY - minY + MARGIN * 2;

  // Place content at (MARGIN, MARGIN): shift left by minX, and flip y-up font
  // space to y-down svg space anchored at the content's top (maxY).
  const inner =
    `<g transform="translate(${MARGIN - minX} ${MARGIN + maxY}) scale(1 -1)">` +
    `${groups.join("")}</g>`;

  return { inner, width, height };
}

/**
 * Returns a standalone SVG string laying tiles left-to-right, sized to its own
 * content box.
 */
export function renderTilesSvg(options: RenderOptions): string {
  const content = buildTilesContent(options);
  if (!content) return "";

  const { inner, width, height } = content;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `viewBox="0 0 ${width} ${height}" ` +
    `width="${width}" height="${height}">${inner}</svg>`
  );
}

export { DEFAULT_ADVANCE, MARGIN };
