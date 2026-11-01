import os
import glob

try:
    from PIL import Image, ImageStat
except ImportError:
    import sys
    print("PIL not installed, using basic file inspection")
    sys.exit(0)

frames_path = os.path.abspath("docs/redesign/evidencias/01-referencia/frames")
frames = sorted(glob.glob(os.path.join(frames_path, "f*.jpg")))

print(f"Total frames encontrados: {len(frames)}")

analysis = []
for f in frames:
    name = os.path.basename(f)
    with Image.open(f) as img:
        w, h = img.size
        stat = ImageStat.Stat(img)
        # mean RGB
        mean_r, mean_g, mean_b = stat.mean[:3]
        brightness = (mean_r * 299 + mean_g * 587 + mean_b * 114) / 1000
        analysis.append({
            "frame": name,
            "width": w,
            "height": h,
            "mean_rgb": [round(mean_r, 1), round(mean_g, 1), round(mean_b, 1)],
            "brightness": round(brightness, 1)
        })
        print(f"{name}: {w}x{h} | RGB=({mean_r:.1f}, {mean_g:.1f}, {mean_b:.1f}) | Brilho={brightness:.1f}")

with open("docs/redesign/evidencias/01-referencia/frames_analysis.txt", "w", encoding="utf-8") as out:
    out.write("ANÁLISE DE FRAMES DA REFERÊNCIA (video-referencia-lovable.webm)\n")
    out.write("=" * 60 + "\n")
    for a in analysis:
        out.write(f"{a['frame']}: {a['width']}x{a['height']} | RGB={a['mean_rgb']} | Brilho={a['brightness']}\n")
