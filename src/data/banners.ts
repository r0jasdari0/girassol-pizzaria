/**
 * Banners do carrossel da home (celular e desktop).
 *
 * Arquivos em public/banners/<file>. Para trocar a arte, salve a nova imagem com o mesmo
 * nome (ou rode `python scripts/prepare-banners.py banners-src/ public/banners/` para
 * converter/otimizar automaticamente). Cada slide leva a uma seção do cardápio.
 */
export type Banner = {
  id: string;
  file: string;
  /** Âncora da seção de destino. */
  href: string;
  alt: string;
  available: boolean;
};

export const banners: Banner[] = [
  { id: "combo-1", file: "combo-1.jpg", href: "#combos", alt: "Combo 1: pizza Big 45 cm + doce pequena + refrigerante 2,25 L por $ 33.000 / R$ 105", available: true },
  { id: "combo-2", file: "combo-2.jpg", href: "#combos", alt: "Combo 2: pizza Grande 35 cm + doce pequena + refrigerante 1,5 L por $ 30.000 / R$ 95", available: true },
  { id: "acai", file: "acai.jpg", href: "#acai", alt: "Açaí ou Cupuaçu: 300, 400 e 500 ml, até 3 acompanhamentos grátis", available: true },
  { id: "picadas", file: "picadas.jpg", href: "#picadas", alt: "Picadas para compartilhar: Girassol Família, Mixta, Picanha, Filé e Da Casa", available: true },
  { id: "bebidas", file: "bebidas.jpg", href: "#bebidas", alt: "Bebidas: refrigerantes, água mineral e suco", available: true },
];

export const bannerSrc = (b: Banner): string => `${import.meta.env.BASE_URL}banners/${b.file}`;
