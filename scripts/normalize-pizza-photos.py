"""
Normaliza fotos de pizza para o builder por fatias.

Uso:
  python scripts/normalize-pizza-photos.py entrada/ public/images/pizzas/

Para cada imagem em `entrada/` (nome = id do sabor, ex.: calabresa.jpg):
  1. detecta a pizza (maior região que difere do fundo, medido pelos cantos);
  2. recorta um quadrado centrado nela, com 4% de margem;
  3. redimensiona para 1000x1000 e salva como JPG otimizado.

Depois, em src/data/products/pizzas.ts, marque o sabor com withPhoto(..., "pizzas/<id>").
Dica de foto: celular fixo acima da mesa, pizza inteira centrada, mesma bandeja e luz para todas.
"""
import os
import sys

from PIL import Image, ImageChops, ImageFilter


def find_pizza_box(im):
    rgb = im.convert("RGB")
    w, h = rgb.size
    corners = [rgb.getpixel((x, y)) for x, y in ((2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3))]
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, bg)).convert("L")
    mask = diff.point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(9))
    return mask.getbbox() or (0, 0, w, h)


def normalize(src, dst, size=1000, margin=0.04):
    im = Image.open(src).convert("RGB")
    x0, y0, x1, y1 = find_pizza_box(im)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    side = max(x1 - x0, y1 - y0) * (1 + margin * 2)
    box = (int(cx - side / 2), int(cy - side / 2), int(cx + side / 2), int(cy + side / 2))
    im.crop(box).resize((size, size), Image.LANCZOS).save(dst, "JPEG", quality=84, optimize=True, progressive=True)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    src_dir, dst_dir = sys.argv[1], sys.argv[2]
    os.makedirs(dst_dir, exist_ok=True)
    for name in sorted(os.listdir(src_dir)):
        base, ext = os.path.splitext(name)
        if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        dst = os.path.join(dst_dir, base + ".jpg")
        normalize(os.path.join(src_dir, name), dst)
        print("ok", dst)


if __name__ == "__main__":
    main()
