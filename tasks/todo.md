# Plan: Render mahjong tiles as inline SVG (replace webfont + screenshot)

## STATUS: DONE (2026-06-07)
All steps implemented and verified. Preview + notation examples + download
(SVG/PNG) now use the data-driven inline SVG renderer. iOS blank-image bug is
structurally gone (PNG goes <img>+canvas, no foreignObject/webfont). Verified
in Chrome: mono + colorful render correctly, PNG raster non-blank
(8848x1000, 88% filled). modern-screenshot removed; Riichi @font-face removed
(font files still downloadable via navbar); obsolete browser-compat footer
warning removed.


## Goal
Replace the current webfont rendering + `modern-screenshot` capture with
pre-extracted SVG glyph data. Fixes iOS blank-image download and removes
reliance on cross-browser COLR/CPAL color-font support. Both the on-screen
preview and the download switch to SVG. Download offers SVG and PNG.

## Verified font facts (Riichi-Mahjong-Colorful / -Monochrome)
- unitsPerEm 1000, ascent 880, descent -120, tile advance 854.
- GSUB `liga` lookup type 4: 259 ligatures, keys length 2-4.
  - Modifiers in keys: `*` (red/aka five), `-` (sideways .hor),
    `=` (sideways double-wide .h2), space (tile back).
  - Need longest-match (greedy) over the `transformString` output, same as
    the font's GSUB shaping. NOT fixed 2-char slicing.
- Colorful: CFF outlines + COLR v0. Each tile glyph = up to 4 layers,
  each layer references a CPAL palette index.
- CPAL palette 0 (6 colors, RGBA):
  0 black, 1 green(77,117,72), 2 red(156,40,20),
  3 tile-base(170,121,66) <- user override target,
  4 blue(5,18,117), 5 white.
- User customization overrides ONLY palette index 3 (see use-color-palette.ts).
- Monochrome: no COLR, single outline per glyph (fill currentColor/black).

## Data flow (confirmed)
input -> transformString(input) -> "1m2m3m" style string
-> [NEW] longest-match ligature lookup -> tile glyph sequence
-> render each tile as <svg> (color version maps layer palette index ->
   resolved color, with index 3 replaced by user tileColor).

## Step 1 — preprocess script (preprocess/extract-tiles.mjs or .py)
- Input: both woff2 fonts in public/fonts/.
- Output: src/lib/tiles-data.json (or .ts) containing:
  - `ligatures`: { "<key>": "<glyphName>" }  (all 259, both variants share keys)
  - `colorful`: { "<glyphName>": [ { d: "<svgPath>", p: <paletteIndex> }, ... ] }
  - `monochrome`: { "<glyphName>": "<svgPath>" }
  - `advances`: { "<glyphName>": <number> }  (for layout; .hor/.h2 differ)
  - `palette`: [ [r,g,b], ... ]  (the 6 base CPAL colors)
  - `metrics`: { unitsPerEm, ascent, descent }
- Use fontTools SVGPathPen on getGlyphSet(); flip Y (font y-up -> svg y-down)
  via viewBox/transform.
- Size budget: ~115 color glyphs * ~15KB path = sizable; minify path numbers,
  expect a few hundred KB. Consider gzip; lazy-load the json (dynamic import).

## Step 2 — JS shaping helper (src/lib/shape-tiles.ts)
- `shapeTiles(text: string): string[]` -> array of glyph names via greedy
  longest-match against `ligatures` (try length 4,3,2 ... then fallthrough).
- Handle chars with no ligature (plain punctuation/space) gracefully.

## Step 3 — SVG tile renderer (src/lib/render-tile-svg.ts)
- `renderTileSvg(glyphName, theme, tileColor): string` -> one inline <svg>.
  - colorful: emit one <path> per layer; fill = palette[p], with p===3
    replaced by tileColor.
  - monochrome: single <path> filled black (or currentColor).
  - viewBox from advance + metrics; preserve baseline alignment.
- `renderTilesSvg(text, theme, tileColor)` -> wrapper <svg> with all tiles
  laid out horizontally using advances. This single SVG is reused for both
  the preview and the download (DRY).

## Step 4 — swap MahjongPreview to inline SVG
- Replace the webfont <span>/<div> with `dangerouslySetInnerHTML` of the
  wrapper SVG (or build SVG via React). Keep responsive font-size scaling by
  scaling the wrapper SVG width (viewBox makes this trivial — drop the
  measure-span hack).
- Remove font-palette CSS dependency for the colorful preview.

## Step 5 — rewrite download (text-to-image.ts -> tiles-export.ts)
- SVG download: serialize the wrapper SVG, Blob `image/svg+xml`, download.
- PNG download: draw the SVG into a canvas via an <img> with the SVG data URL
  (no foreignObject, no webfont) -> canvas.toBlob('image/png'). iOS-safe.
- Keep Web Share API path on mobile for the PNG file.
- Update ActionButtons download menu to offer SVG / PNG (was single button).

## Step 6 — cleanup
- Remove `modern-screenshot` dependency once unused (check package.json).
- Remove Riichi-Mahjong @font-face rules from globals.css if preview no longer
  uses the webfont (KEEP the downloadable .woff2 files in public/fonts — the
  navbar "download font" feature still serves them).
- Remove use-color-palette.ts font-palette injection (color now resolved in JS).
- Update README if it documents the rendering approach.

## Risks / open points to verify while implementing
- R1 (highest): confirm longest-match over transformString output reproduces
  the exact tiles the webfont shows for representative inputs
  (e.g. "123m0p5s*", sideways "1m-", back " ", "1234567z"). Build a small
  visual diff: render old webfont vs new SVG side by side during dev.
- R2: .hor / .h2 advances and vertical placement (sideways tiles sit lower).
  Verify baseline/positioning matches the font.
- R3: COLR layer draw order (layer0 bottom). Emit in array order.
- R4: json size — if too big, lazy-load and/or split colorful out.

## Out of scope
- No change to notation input parsing UX, languages, yaku selector.
- Keep font files downloadable via navbar.

## Verification
- Visual parity check old vs new on desktop Chrome + Safari.
- Manual iOS Safari: download produces a real non-blank PNG and an SVG.
- Type check (tsc --noEmit) + build.
