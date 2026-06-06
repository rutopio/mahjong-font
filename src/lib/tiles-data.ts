/**
 * Typed loader for the pre-extracted mahjong tile SVG data.
 * The JSON is large (~1.2MB raw, ~300KB gzipped) so it is lazy-loaded via
 * dynamic import and cached after the first call.
 */

interface ColorLayer {
  /** SVG path data in font coordinate space (y-up, unitsPerEm scale). */
  d: string;
  /** CPAL palette index for this layer's fill. */
  p: number;
}

export interface TilesData {
  metrics: { unitsPerEm: number; ascent: number; descent: number };
  /** Base CPAL colors as [r, g, b]. */
  palette: [number, number, number][];
  /** Char sequence (e.g. "1m", "5m*-") -> tile glyph name. */
  ligatures: Record<string, string>;
  /** Glyph name -> horizontal advance in font units. */
  advances: Record<string, number>;
  /** Glyph name -> visible bounds [xMin, yMin, xMax, yMax] in font units. */
  bounds: Record<string, [number, number, number, number]>;
  /** Glyph name -> COLR layers for the colorful variant. */
  colorful: Record<string, ColorLayer[]>;
  /** Glyph name -> single outline path for the monochrome variant. */
  monochrome: Record<string, string>;
}

let cache: TilesData | null = null;

export async function loadTilesData(): Promise<TilesData> {
  if (cache) return cache;
  const data = (await import("./tiles-data.json"))
    .default as unknown as TilesData;
  cache = data;
  return data;
}
