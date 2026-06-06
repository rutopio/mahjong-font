#!/usr/bin/env python3
"""
Extract mahjong tile glyph data from the Riichi-Mahjong woff2 fonts into a
single JSON consumed by the web app. This replaces webfont rendering with
inline SVG, fixing iOS download blanks and cross-browser COLR/CPAL support.

Output: src/lib/tiles-data.json

Run from repo root:  python3 preprocess/extract-tiles.py
"""

import json
import os

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
# Source fonts live alongside this script (not in public/), so they aren't
# shipped to the web build; only the generated tiles-data.json is.
COLORFUL = os.path.join(HERE, "fonts/Riichi-Mahjong-Colorful.woff2")
MONOCHROME = os.path.join(HERE, "fonts/Riichi-Mahjong-Monochrome.woff2")
OUT = os.path.join(ROOT, "src/lib/tiles-data.json")


def get_ligatures(font):
    """Map char sequence -> target glyph name from the GSUB liga lookup."""
    cmap = font.getBestCmap()
    rev = {gn: chr(cp) for cp, gn in cmap.items()}
    gsub = font["GSUB"].table
    subtables = [
        s
        for lk in gsub.LookupList.Lookup
        for s in lk.SubTable
        if s.LookupType == 4
    ]
    ligs = {}
    for st in subtables:
        for first, ligset in st.ligatures.items():
            for lig in ligset:
                comps = [first] + list(lig.Component)
                seq = "".join(rev.get(c, "") for c in comps)
                if seq:
                    ligs[seq] = lig.LigGlyph
    return ligs


def glyph_path(glyph_set, name):
    """Draw a single glyph as an SVG path string (font coordinate space)."""
    pen = SVGPathPen(glyph_set)
    glyph_set[name].draw(pen)
    return pen.getCommands()


def extract_colorful(font, glyph_names):
    """For each tile glyph, list its COLR layers as {d, p}.

    Glyphs without COLR layers are emitted as a single layer using their own
    outline with palette index 0 (black).
    """
    colr = font["COLR"].ColorLayers  # dict: glyphName -> [LayerRecord]
    glyph_set = font.getGlyphSet()
    out = {}
    for name in glyph_names:
        if name in colr:
            layers = []
            for layer in colr[name]:
                d = glyph_path(glyph_set, layer.name)
                if d:
                    layers.append({"d": d, "p": layer.colorID})
            out[name] = layers
        else:
            d = glyph_path(glyph_set, name)
            out[name] = [{"d": d, "p": 0}] if d else []
    return out


def extract_monochrome(font, glyph_names):
    """Single outline per tile glyph for the monochrome variant."""
    glyph_set = font.getGlyphSet()
    out = {}
    for name in glyph_names:
        if name in glyph_set:
            d = glyph_path(glyph_set, name)
            out[name] = d
        else:
            out[name] = ""
    return out


def extract_bounds(font, glyph_names):
    """Visible bounding box per tile glyph as [xMin, yMin, xMax, yMax].

    For COLR glyphs the bounds are the union of all layer glyph bounds; advance
    width understates the visible width (tiles overlap), so layout/viewBox must
    use these bounds, not the advance.
    """
    colr = font["COLR"].ColorLayers
    glyph_set = font.getGlyphSet()
    out = {}
    for name in glyph_names:
        layer_names = (
            [layer.name for layer in colr[name]] if name in colr else [name]
        )
        box = None
        for ln in layer_names:
            if ln not in glyph_set:
                continue
            pen = BoundsPen(glyph_set)
            glyph_set[ln].draw(pen)
            if pen.bounds is None:
                continue
            box = pen.bounds if box is None else (
                min(box[0], pen.bounds[0]),
                min(box[1], pen.bounds[1]),
                max(box[2], pen.bounds[2]),
                max(box[3], pen.bounds[3]),
            )
        out[name] = [round(v) for v in box] if box else [0, 0, 0, 0]
    return out


def extract_palette(font):
    """The 6 base CPAL colors as [r, g, b]."""
    cpal = font["CPAL"]
    return [[c.red, c.green, c.blue] for c in cpal.palettes[0]]


# Notation chars that produce horizontal gaps. They map to plain (pathless)
# cmap glyphs whose advance widths create the spacing, but they are not GSUB
# ligatures, so the shaper would otherwise skip them. " " is a small gap and
# "_" a large gap; both must be registered so they advance the layout.
GAP_CHARS = [" ", "_"]


def add_gap_chars(font, ligatures):
    """Register gap chars as single-char 'ligatures' so the shaper keeps them."""
    cmap = font.getBestCmap()
    for ch in GAP_CHARS:
        glyph = cmap.get(ord(ch))
        if glyph:
            ligatures[ch] = glyph


def main():
    colorful = TTFont(COLORFUL)
    monochrome = TTFont(MONOCHROME)

    ligatures = get_ligatures(colorful)
    add_gap_chars(colorful, ligatures)
    target_glyphs = sorted(set(ligatures.values()))

    head = colorful["head"]
    hhea = colorful["hhea"]
    hmtx = colorful["hmtx"]
    advances = {g: hmtx[g][0] for g in target_glyphs if g in hmtx.metrics}

    data = {
        "metrics": {
            "unitsPerEm": head.unitsPerEm,
            "ascent": hhea.ascent,
            "descent": hhea.descent,
        },
        "palette": extract_palette(colorful),
        "ligatures": ligatures,
        "advances": advances,
        "bounds": extract_bounds(colorful, target_glyphs),
        "colorful": extract_colorful(colorful, target_glyphs),
        "monochrome": extract_monochrome(monochrome, target_glyphs),
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"), ensure_ascii=False)

    size = os.path.getsize(OUT)
    print(f"Wrote {OUT} ({size / 1024:.1f} KB)")
    print(
        f"ligatures: {len(ligatures)}, tile glyphs: {len(target_glyphs)}, "
        f"palette: {len(data['palette'])} colors"
    )


if __name__ == "__main__":
    main()
