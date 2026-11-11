// Load the large outline dataset only when rendering tiles.

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

let loadPromise: Promise<TilesData> | undefined;

export function loadTilesData(): Promise<TilesData> {
  loadPromise ??= import("../data/tiles-data.json")
    .then((module) => module.default as unknown as TilesData)
    .catch((error) => {
      loadPromise = undefined;
      throw error;
    });
  return loadPromise;
}
