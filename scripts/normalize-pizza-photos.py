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
    """Caixa da pizza: pixels bem diferentes do fundo, com erosão para ignorar sombras e ruído."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    corners = [rgb.getpixel((x, y)) for x, y in ((2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3))]
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, bg)).convert("L")
    small = diff.resize((w // 4, h // 4))
    mask = small.point(lambda v: 255 if v > 70 else 0).filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))
    b = mask.getbbox()
    if not b:
        return (0, 0, w, h)
    return (b[0] * 4, b[1] * 4, b[2] * 4, b[3] * 4)


def normalize(src, dst, size=1000, margin=0.03):
    im = Image.open(src).convert("RGB")
    x0, y0, x1, y1 = find_pizza_box(im)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    side = max(x1 - x0, y1 - y0) * (1 + margin * 2)
    # canvas quadrado preto centrado na pizza (áreas fora da foto ficam pretas)
    canvas = Image.new("RGB", (int(side), int(side)), (0, 0, 0))
    canvas.paste(im, (int(side / 2 - cx), int(side / 2 - cy)))
    canvas.resize((size, size), Image.LANCZOS).save(dst, "JPEG", quality=84, optimize=True, progressive=True)


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
