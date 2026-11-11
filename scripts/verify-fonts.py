#!/usr/bin/env python3
"""Verify generated Noto unicode-range declarations and retained font coverage."""

from __future__ import annotations

import re
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "src/styles/generated-noto.css").read_text(encoding="utf-8")


def expand_ranges(value: str) -> set[int]:
    codepoints = set()
    for item in value.split(","):
        start, _, end = item.strip().removeprefix("U+").partition("-")
        codepoints.update(range(int(start, 16), int(end or start, 16) + 1))
    return codepoints


def main() -> None:
    blocks = re.findall(r"@font-face\s*\{([^}]*)\}", CSS, re.S)
    if len(blocks) != 2:
        raise ValueError(f"Expected two generated Noto faces, got {len(blocks)}")
    for family, block in zip(("tc", "jp"), blocks, strict=True):
        match = re.search(rf'/fonts/ui/(noto-{family}-static\.woff2)', block)
        declared = re.search(r'unicode-range:\s*([^;]+);', block)
        if not match or not declared or "font-display: swap;" not in block:
            raise ValueError(f"Incomplete Noto {family} face")
        path = ROOT / "public/fonts/ui" / match.group(1)
        font = TTFont(path)
        actual = set(font.getBestCmap())
        if actual != expand_ranges(declared.group(1)):
            raise ValueError(f"Incorrect unicode-range: {path}")
        if any(tag in font for tag in ("fpgm", "prep", "cvt ")):
            raise ValueError(f"Unexpected hinting: {path}")
        print(f"{path.relative_to(ROOT)}: {path.stat().st_size} bytes, {len(actual)} codepoints")

    original = TTFont(ROOT / "scripts/font-sources/PaperMono-original.woff2")
    optimized = TTFont(ROOT / "public/fonts/PaperMono[wght].woff2")
    if original.getGlyphOrder() != optimized.getGlyphOrder() or original.getBestCmap() != optimized.getBestCmap():
        raise ValueError("Paper Mono glyph order or coverage changed")


if __name__ == "__main__":
    main()
