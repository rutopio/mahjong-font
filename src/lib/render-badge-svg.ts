/**
 * Builds a tile badge SVG cropped to the tile group, rendered at a fixed
 * height (width scales proportionally). Served inline by the /img endpoint so
 * it can be embedded like a shields.io badge. Pure and platform-agnostic.
 */

import { buildTilesContent } from "./render-tile-svg";
import type { TilesData } from "./tiles-data";

/** White padding around the tiles, in the badge's own pixel units. */
const BADGE_PADDING = 24;
/** Rendered height in px; width scales proportionally via the viewBox. */
const BADGE_HEIGHT = 500;
const BG_COLOR = "#ffffff";

interface BadgeOptions {
  text: string;
  theme: string;
  tileColor: string;
  data: TilesData;
}

/**
 * Returns the badge as an SVG string, or null when there are no tiles to
 * render. The viewBox hugs the tile content plus a small padding.
 */
export function renderBadgeSvg({
  text,
  theme,
  tileColor,
  data,
}: BadgeOptions): string | null {
  const content = buildTilesContent({ text, theme, tileColor, data });
  if (!content) return null;

  const { inner, width, height } = content;
  const w = width + BADGE_PADDING * 2;
  const h = height + BADGE_PADDING * 2;

  // Keep the intrinsic coordinate system in the viewBox (no distortion) and
  // scale the rendered size to a fixed height; width follows proportionally.
  const renderH = BADGE_HEIGHT;
  const renderW = Math.round((w * BADGE_HEIGHT) / h);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${renderW}" height="${renderH}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${BG_COLOR}"/>` +
    `<g transform="translate(${BADGE_PADDING} ${BADGE_PADDING})">${inner}</g>` +
    `</svg>`
  );
}
