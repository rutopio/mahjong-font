#!/usr/bin/env python3
"""Extract font outlines and shaping data for the shared SVG renderer."""

import json
import os

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
COLORFUL = os.path.join(ROOT, "assets/fonts/woff2/Riichi-Mahjong-Colorful.woff2")
MONOCHROME = os.path.join(ROOT, "assets/fonts/woff2/Riichi-Mahjong-Monochrome.woff2")
OUT = os.path.join(ROOT, "src/data/tiles-data.json")


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
    """Per-glyph layers: d is SVG path data; p is a CPAL index."""
    colr = font["COLR"].ColorLayers
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
    """Return [xMin, yMin, xMax, yMax] across all visible layers.

    Tile outlines overlap, so advance widths would clip the exported SVG.
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
    """Base CPAL colors as [r, g, b] bytes."""
    cpal = font["CPAL"]
    return [[c.red, c.green, c.blue] for c in cpal.palettes[0]]


# Gap glyphs have advances but no GSUB ligatures; register them so shaping preserves spacing.
GAP_CHARS = [" ", "_"]


def add_gap_chars(font, ligatures):
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
