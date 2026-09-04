import type { Lang, Price } from "../types";

/**
 * Banners do carrossel da home.
 *
 * A foto é só o fundo (public/banners/<file>); título, texto, preços e botão são
 * desenhados pelo site por cima, no idioma e na moeda ativos. Para trocar a arte,
 * salve a nova foto com o mesmo nome (ou rode scripts/prepare-banners.py).
 * Preços vêm de `prices` e devem espelhar os produtos em src/data/products.
 */
export type Banner = {
  id: string;
  file: string;
  /** Âncora da seção de destino. */
  href: string;
  /** Abre um builder em vez de rolar até a seção. */
  action?: "pizza" | "acai";
  theme: "dark" | "purple";
  eyebrow: Record<Lang, string>;
  title: Record<Lang, string>;
  text?: Record<Lang, string>;
  cta: Record<Lang, string>;
  prices?: { label: string; price: Price }[];
  available: boolean;
};

export const banners: Banner[] = [
  {
    id: "pizza",
    file: "pizza.jpg",
    href: "#pizzas",
    action: "pizza",
    theme: "dark",
    eyebrow: { pt: "Do seu jeito", es: "A tu manera" },
    title: { pt: "Monte sua pizza", es: "Armá tu pizza" },
    text: { pt: "45 sabores, 5 tamanhos e borda recheada.", es: "45 sabores, 5 tamaños y borde relleno." },
    cta: { pt: "Montar agora", es: "Armar ahora" },
    available: true,
  },
  {
    id: "combos",
    file: "combos.jpg",
    href: "#combos",
    theme: "dark",
    eyebrow: { pt: "Mais sabor, mais economia", es: "Más sabor, más ahorro" },
    title: { pt: "Combos 1 e 2", es: "Combos 1 y 2" },
    text: { pt: "Pizza + doce pequena + refrigerante.", es: "Pizza + dulce pequeña + gaseosa." },
    prices: [
      { label: "Combo 1", price: { brl: 105, ars: 33000 } },
      { label: "Combo 2", price: { brl: 95, ars: 30000 } },
    ],
    cta: { pt: "Ver combos", es: "Ver combos" },
    available: true,
  },
  {
    id: "acai",
    file: "acai.jpg",
    href: "#acai",
    action: "acai",
    theme: "purple",
    eyebrow: { pt: "Açaí ou Cupuaçu", es: "Açaí o Cupuaçu" },
    title: { pt: "Monte o seu", es: "Armá el tuyo" },
    text: { pt: "Até 3 acompanhamentos grátis.", es: "Hasta 3 acompañamientos gratis." },
    cta: { pt: "Montar açaí", es: "Armar açaí" },
    available: true,
  },
  {
    id: "picadas",
    file: "picadas.jpg",
    href: "#picadas",
    theme: "dark",
    eyebrow: { pt: "Para compartilhar", es: "Para compartir" },
    title: { pt: "Picadas", es: "Picadas" },
    text: { pt: "Girassol Família, Mixta, Picanha, Filé e Da Casa.", es: "Girassol Família, Mixta, Picanha, Filé y Da Casa." },
    cta: { pt: "Ver picadas", es: "Ver picadas" },
    available: true,
  },
  {
    id: "carnes",
    file: "carnes.jpg",
    href: "#carnes",
    theme: "dark",
    eyebrow: { pt: "Na chapa", es: "A la plancha" },
    title: { pt: "Carnes", es: "Carnes" },
    text: { pt: "Contra filé, coraçãozinho, frango e tilápia.", es: "Contra filé, corazoncitos, pollo y tilapia." },
    cta: { pt: "Ver carnes", es: "Ver carnes" },
    available: true,
  },
  {
    id: "bebidas",
    file: "bebidas.jpg",
    href: "#bebidas",
    theme: "dark",
    eyebrow: { pt: "Bem geladas", es: "Bien frías" },
    title: { pt: "Bebidas", es: "Bebidas" },
    text: { pt: "Coca-Cola, Sprite, Fanta, Guaraná, água e suco.", es: "Coca-Cola, Sprite, Fanta, Guaraná, agua y jugo." },
    cta: { pt: "Ver bebidas", es: "Ver bebidas" },
    available: true,
  },
];

export const bannerSrc = (b: Banner): string => `${import.meta.env.BASE_URL}banners/${b.file}`;
