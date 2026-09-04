"""
Converte e otimiza os banners do carrossel para o celular.

Uso:
  python scripts/prepare-banners.py banners-src/ public/banners/

Para cada imagem em `banners-src/` (PNG, JPG ou WebP):
  - converte para JPG progressivo, qualidade 86;
  - limita a 1600 px de largura (nítido em qualquer celular, leve para carregar);
  - mantém o nome do arquivo (combo-1.png → combo-1.jpg).

Nomes esperados por src/data/banners.ts:
  combo-1.jpg · combo-2.jpg · acai.jpg · picadas.jpg · bebidas.jpg
"""
import os
import sys

from PIL import Image


def prepare(src: str, dst: str, max_w: int = 1600) -> None:
    im = Image.open(src)
    if im.mode in ("RGBA", "P", "LA"):
        bg = Image.new("RGB", im.size, (247, 181, 0))  # amarelo Girassol atrás de transparências
        bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").getchannel("A"))
        im = bg
    else:
        im = im.convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(dst, "JPEG", quality=86, optimize=True, progressive=True)
    print("ok", dst, im.size, os.path.getsize(dst) // 1024, "KB")


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    src_dir, dst_dir = sys.argv[1], sys.argv[2]
    os.makedirs(dst_dir, exist_ok=True)
    for name in sorted(os.listdir(src_dir)):
        base, ext = os.path.splitext(name)
        if ext.lower() not in (".png", ".jpg", ".jpeg", ".webp"):
            continue
        prepare(os.path.join(src_dir, name), os.path.join(dst_dir, base + ".jpg"))


if __name__ == "__main__":
    main()
