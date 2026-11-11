// Resolve COLR layers to SVG paths so rendering does not depend on browser color-font support.

import { DEFAULT_TILE_COLOR } from "./constants";
import { shapeTiles } from "./shape-tiles";
import type { TilesData } from "./tiles-data";

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;

/** CPAL index the user is allowed to recolor (the tile base). */
const TILE_BASE_INDEX = 3;

/** Default advance for glyphs missing from the advances table. */
const DEFAULT_ADVANCE = 854;

/** Font-unit padding prevents outlines from clipping at the viewBox edge. */
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
  /** Six-digit hex color overriding the tile base (colorful only). */
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

export function buildTilesContent({
  text,
  theme,
  tileColor,
  data,
}: RenderOptions): TilesContent | null {
  const { palette, ligatures, advances, bounds, colorful, monochrome } = data;
  const isColorful = theme !== "monochrome";
  // This string is also served as SVG, so validate colors before interpolating attributes.
  const safeTileColor = HEX_COLOR_RE.test(tileColor)
    ? tileColor
    : DEFAULT_TILE_COLOR;

  const glyphs = shapeTiles(text, ligatures);
  if (glyphs.length === 0) return null;

  let x = 0;
  const groups: string[] = [];
  // Overlapping tiles can extend beyond their advances; measure visible glyph bounds.
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
        const fill = resolveColor(layer.p, palette, safeTileColor);
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

  // Flip y-up font coordinates to y-down SVG coordinates, keeping the top-left margin.
  const inner =
    `<g transform="translate(${MARGIN - minX} ${MARGIN + maxY}) scale(1 -1)">` +
    `${groups.join("")}</g>`;

  return { inner, width, height };
}

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
