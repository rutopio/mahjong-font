// Greedy longest-match shaping follows the font's GSUB ligature order.

// The extracted table has keys up to four characters, including one-character gaps.
const MAX_LIG_LEN = 4;

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
      i += 1;
    }
  }

  return glyphs;
}
