/**
 * Reproduces the font's GSUB ligature shaping in JS: greedy longest-match of
 * the input string against the ligature table, mirroring how the webfont turns
 * "1m2m3m" into individual tile glyphs.
 */

/** Ligature keys are length 2-4; try longest first. */
const MAX_LIG_LEN = 4;

/**
 * Convert a (transformed) notation string into a sequence of tile glyph names.
 * Characters that match no ligature are skipped (e.g. stray punctuation).
 */
export function shapeTiles(
  text: string,
  ligatures: Record<string, string>
): string[] {
  const glyphs: string[] = [];
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (let len = MAX_LIG_LEN; len >= 1; len--) {
      if (i + len > text.length) continue;
      const slice = text.slice(i, i + len);
      const glyph = ligatures[slice];
      if (glyph) {
        glyphs.push(glyph);
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // No ligature covers this character; skip it.
      i += 1;
    }
  }

  return glyphs;
}
