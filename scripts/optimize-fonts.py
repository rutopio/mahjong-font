#!/usr/bin/env python3
"""Regenerate checked-in font subsets by hand after visible copy or font CSS changes."""

from __future__ import annotations

import hashlib
import re
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".font-source-cache"
SOURCES = ROOT / "scripts/font-sources"
OUTPUT = ROOT / "public/fonts" / "ui"
PAPER_OUTPUT = ROOT / "public/fonts/PaperMono[wght].woff2"
GENERATED_CSS = ROOT / "src/styles/generated-noto.css"
FONT_CSS = ROOT / "src/styles/fonts.css"
VITE = ROOT / "vite.config.ts"
UPSTREAM = {
    "tc": (
        "https://raw.githubusercontent.com/google/fonts/b950a7257470b900078f2bf3223823a8602de7e1/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf",
        "864727d210d54f2537bbe23b3a839436c3992af72de9322af5270897246bd44f",
    ),
    "jp": (
        "https://raw.githubusercontent.com/google/fonts/b950a7257470b900078f2bf3223823a8602de7e1/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf",
        "c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f",
    ),
}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source(family: str) -> Path:
    url, digest = UPSTREAM[family]
    CACHE.mkdir(exist_ok=True)
    path = CACHE / f"noto-{family}.ttf"
    if not path.exists() or sha(path) != digest:
        urllib.request.urlretrieve(url, path)
    if sha(path) != digest:
        raise ValueError(f"Source checksum changed: {url}")
    return path


def unicode_range(codepoints: set[int]) -> str:
    runs: list[list[int]] = []
    for cp in sorted(codepoints):
        if runs and cp == runs[-1][1] + 1:
            runs[-1][1] = cp
        else:
            runs.append([cp, cp])
    return ",".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in runs)


def content_codepoints() -> set[int]:
    # Include inline component text/styles and translations; exclude generated tile data.
    paths = (ROOT / "src").rglob("*")
    chars = set().union(*(
        set(map(ord, path.read_text(encoding="utf-8")))
        for path in paths
        if path.suffix in {".ts", ".tsx"} and path.name != "routeTree.gen.ts"
    ))
    chars.update(*(
        set(map(ord, path.read_text(encoding="utf-8")))
        for path in (ROOT / "src/locales").glob("*.json")
    ))
    return chars


def package_coverage(family: str) -> set[int]:
    files = ROOT / f"node_modules/@fontsource-variable/noto-sans-{family}/files"
    shards = list(files.glob("*.woff2"))
    if not shards:
        raise ValueError(f"Install dependencies before regenerating: {files}")
    return set().union(*(set(TTFont(path).getBestCmap()) for path in shards))


def save_noto(family: str, content: set[int], inter: set[int]) -> str:
    font = TTFont(source(family))
    wanted = (content - inter) & set(font.getBestCmap()) & package_coverage(family)
    wanted = {cp for cp in wanted if cp >= 0xA0}
    options = subset.Options()
    options.hinting = False
    options.layout_features = ["kern", "halt", "palt"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    worker = subset.Subsetter(options=options)
    worker.populate(unicodes=wanted)
    worker.subset(font)
    # Layout closure can add extra cmap entries; this face owns only wanted text.
    for table in font["cmap"].tables:
        if table.isUnicode():
            for cp in set(table.cmap) - wanted:
                del table.cmap[cp]
    font.flavor = "woff2"
    font.recalcTimestamp = False
    font["head"].modified = 3600000000
    path = OUTPUT / f"noto-{family}-static.woff2"
    font.save(path)
    actual = set(TTFont(path).getBestCmap())
    if actual != wanted:
        raise ValueError(f"Incorrect Noto coverage: {path}: {wanted ^ actual}")
    print(f"{path.relative_to(ROOT)}: {path.stat().st_size} bytes, {len(actual)} codepoints")
    return f'''@font-face {{
  font-family: "Noto Sans {family.upper()} Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url("/fonts/ui/noto-{family}-static.woff2?v={sha(path)[:8]}") format("woff2");
  unicode-range: {unicode_range(actual)};
}}'''


def save_paper() -> str:
    original = TTFont(SOURCES / "PaperMono-original.woff2")
    font = TTFont(SOURCES / "PaperMono-original.woff2")
    options = subset.Options()
    options.flavor = "woff2"
    options.hinting = True
    options.glyph_names = True
    options.retain_gids = True
    options.layout_features = ["ccmp", "locl", "rvrn", "mark", "mkmk"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.recalc_bounds = False
    worker = subset.Subsetter(options=options)
    worker.populate(glyphs=font.getGlyphOrder())
    worker.subset(font)
    font.flavor = "woff2"
    font.recalcTimestamp = False
    path = PAPER_OUTPUT
    font.save(path)
    check = TTFont(path)
    if check.getGlyphOrder() != original.getGlyphOrder() or check.getBestCmap() != original.getBestCmap():
        raise ValueError("Paper Mono glyph order or coverage changed")
    print(f"{path.relative_to(ROOT)}: {path.stat().st_size} bytes")
    return sha(path)[:8]


def replace_exact(path: Path, pattern: str, replacement: str) -> None:
    text = path.read_text(encoding="utf-8")
    text, count = re.subn(pattern, lambda _: replacement, text)
    if count != 1:
        raise ValueError(f"Expected one URL in {path}: {pattern}; found {count}")
    path.write_text(text, encoding="utf-8")


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    content = content_codepoints()
    inter = set().union(*(
        set(TTFont(path).getBestCmap())
        for path in OUTPUT.glob("inter-*.woff2")
    ))
    paper_hash = save_paper()
    replace_exact(
        FONT_CSS,
        r"/fonts/PaperMono\[wght\]\.woff2(?:\?v=[0-9a-f]{8})?",
        f"/fonts/PaperMono[wght].woff2?v={paper_hash}",
    )
    replace_exact(
        VITE,
        r"/fonts/PaperMono%5Bwght%5D\.woff2(?:\?v=[0-9a-f]{8})?",
        f"/fonts/PaperMono%5Bwght%5D.woff2?v={paper_hash}",
    )
    GENERATED_CSS.write_text(
        "/* Generated by scripts/optimize-fonts.py; edit the script, then rerun. */\n"
        + "\n\n".join(save_noto(family, content, inter) for family in ("tc", "jp"))
        + "\n", encoding="utf-8",
    )


if __name__ == "__main__":
    main()
