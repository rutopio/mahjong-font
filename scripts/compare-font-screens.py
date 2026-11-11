#!/usr/bin/env python3
"""Compare font-browser-audit screenshots and network logs.

Run: python3 scripts/compare-font-screens.py BEFORE_DIR AFTER_DIR DIFF_DIR
Requires Pillow and NumPy. A nonzero exit means content or pixels changed.
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image


before_dir, after_dir, diff_dir = map(Path, sys.argv[1:4])
diff_dir.mkdir(parents=True, exist_ok=True)
before = {x["route"]: x for x in json.loads((before_dir / "results.json").read_text())}
after = {x["route"]: x for x in json.loads((after_dir / "results.json").read_text())}
if set(before) != set(after):
    raise SystemExit(f"Route sets differ: {set(before) ^ set(after)}")
changed = False
rows = []
for route in before:
    slug = "home" if route == "/" else route[1:].replace("/", "-")
    left = np.asarray(Image.open(before_dir / f"{slug}.png").convert("RGB"))
    right = np.asarray(Image.open(after_dir / f"{slug}.png").convert("RGB"))
    content_equal = before[route]["bodyText"] == after[route]["bodyText"]
    size_equal = left.shape == right.shape
    if size_equal:
        delta = np.abs(left.astype(np.int16) - right.astype(np.int16))
        mask = np.any(delta != 0, axis=2)
        count = int(mask.sum())
        max_channel = int(delta.max())
        if count:
            visualization = np.minimum(delta * 8, 255).astype(np.uint8)
            Image.fromarray(visualization).save(diff_dir / f"{slug}.png")
    else:
        count = -1
        max_channel = -1
    changed |= not content_equal or not size_equal or count != 0
    rows.append({"route": route, "content_equal": content_equal,
                 "before_dimensions": list(left.shape), "after_dimensions": list(right.shape),
                 "differing_pixels": count, "max_channel_delta": max_channel,
                 "before_font_bytes": sum(before[route]["fonts"].values()),
                 "after_font_bytes": sum(after[route]["fonts"].values()),
                 "before_fonts": before[route]["fonts"], "after_fonts": after[route]["fonts"],
                 "before_preloads": before[route]["preloads"],
                 "after_preloads": after[route]["preloads"]})
    print(f"{route}: content={content_equal} dimensions={size_equal} pixels={count} maxΔ={max_channel} fonts={rows[-1]['before_font_bytes']}→{rows[-1]['after_font_bytes']}")
(diff_dir / "results.json").write_text(json.dumps(rows, indent=2))
sys.exit(1 if changed else 0)
