"""Create responsive WebP copies; keep the supplied originals unchanged.

Run with Python + Pillow: python scripts/optimize-images.py
"""
from pathlib import Path
import json
import re
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source = (root / "src/scenePhotos.ts").read_text(encoding="utf-8")
paths = re.findall(r'"(\./assets/[^"\n]+\.(?:png|jpg))"', source)
if not paths:
    paths = ["./assets/housing-app.png", "./assets/broker-message.png"]
    paths += ["./assets/scenes/" + p.name for p in sorted((root / "src/assets/scenes").glob("*.jpg"))]
out = root / "src/assets/optimized"
out.mkdir(exist_ok=True)
report = []
for name in dict.fromkeys(paths):
    original = root / "src" / name
    with Image.open(original) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        row = {"file": original.name, "originalBytes": original.stat().st_size}
        for width, suffix in [(1600, ""), (800, "-small")]:
            copy = image.copy()
            copy.thumbnail((width, width), Image.Resampling.LANCZOS)
            target = out / (original.stem + suffix + ".webp")
            copy.save(target, "WEBP", quality=85, method=6)
            row[str(width)] = {"bytes": target.stat().st_size, "width": copy.width, "height": copy.height}
        report.append(row)
(root / "image-optimization.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
for key in ["originalBytes", "1600", "800"]:
    print(key, sum(row[key] if key == "originalBytes" else row[key]["bytes"] for row in report))
