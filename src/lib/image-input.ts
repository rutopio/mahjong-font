/** Bound public image generation before shaping or rasterizing user input. */
const MAX_IMAGE_TILE_LENGTH = 512;

export function isValidImageTile(tile: string): boolean {
  return tile.length > 0 && tile.length <= MAX_IMAGE_TILE_LENGTH;
}

export function decodeImageTilePath(segment: string): string | null {
  try {
    const tile = decodeURIComponent(segment);
    return isValidImageTile(tile) ? tile : null;
  } catch {
    return null;
  }
}
