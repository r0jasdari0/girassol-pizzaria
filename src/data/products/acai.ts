import { img } from "../../lib/assets";
import type { AcaiBase, AcaiRecipe, AcaiSize, AcaiTopping } from "../../types";

export const acaiBases: AcaiBase[] = [
  { id: "acai", name: "Açaí", color: "#4B1D5E", available: true },
  { id: "cupuacu", name: "Cupuaçu", color: "#F3E7C4", available: true },
];

export const acaiSizes: AcaiSize[] = [
  { id: "a300", name: "300 ml", ml: 300, price: { brl: 18, ars: 5500 }, available: true },
  { id: "a400", name: "400 ml", ml: 400, price: { brl: 23, ars: 7000 }, available: true },
  { id: "a500", name: "500 ml", ml: 500, price: { brl: 28, ars: 8500 }, available: true },
];

/** Quantos acompanhamentos entram grátis em qualquer tamanho. */
export const freeToppings = 3;

/**
 * TODO: confirmar preços dos extras com o cardápio da Girassol.
 * Os valores abaixo são provisórios: comum R$ 3 / $ 1.000, premium R$ 5 / $ 1.500.
 */
const std = { brl: 3, ars: 1000 };
const prem = { brl: 5, ars: 1500 };

const t = (id: string, name: string, shape: AcaiTopping["shape"], color: string, premium = false): AcaiTopping => ({
  id,
  name,
  shape,
  color,
  price: premium ? prem : std,
  available: true,
});

export const acaiToppings: AcaiTopping[] = [
  t("leite-condensado", "Leite condensado", "drizzle", "#FFF6E0"),
  t("ninho", "Leite em pó Ninho", "sprinkle", "#FFF9EC"),
  t("nutella", "Nutella", "drizzle", "#4A2A18", true),
  t("confete", "Confete", "sprinkle", "#E6392B"),
  t("morango", "Morango", "slice", "#D9273B"),
  t("kiwi", "Kiwi", "slice", "#7BB35A"),
  t("pacoca", "Paçoca", "chunk", "#C9A06A"),
  t("banana", "Banana", "slice", "#F3E2A0"),
  t("gominhas", "Gominhas", "chunk", "#F26A8D"),
  t("ovomaltine", "Ovo Maltine", "sprinkle", "#8B5A3C", true),
  t("farofa-amendoim", "Farofa de amendoim", "sprinkle", "#D8B078"),
  t("flocos-chocolate", "Flocos de chocolate", "sprinkle", "#3A2418"),
  t("manga", "Manga", "chunk", "#F7B531"),
  t("ouro-branco", "Ouro Branco", "chunk", "#F0E4C8", true),
  t("canudo", "Canudo", "chunk", "#C9924A"),
  t("kitkat", "KitKat", "chunk", "#B3261E", true),
  t("bis", "Bis", "chunk", "#3A2418", true),
  t("marshmallow", "Marshmallow", "chunk", "#FFFFFF"),
  t("amendoim", "Amendoim", "sprinkle", "#B98748"),
  t("granola", "Granola", "sprinkle", "#A9803F"),
  t("chantilly", "Chantilly", "cream", "#FFFFFF"),
  t("sonho-de-valsa", "Sonho de Valsa", "chunk", "#8B1E2D", true),
  t("granulado", "Granulado", "sprinkle", "#4A2A18"),
  t("chocoball", "Chocoball", "chunk", "#5A3826", true),
  t("fini", "Fini", "chunk", "#39B54A", true),
  t("pasta-amendoim", "Pasta de amendoim", "drizzle", "#B4783C"),
];

export const acaiRecipes: AcaiRecipe[] = [
  { id: "salada", name: "Salada de Açaí", toppingIds: ["leite-condensado", "morango", "banana", "manga", "kiwi", "ninho"], available: true, image: img("acai-salada") },
  { id: "pacoca", name: "Paçoca", toppingIds: ["leite-condensado", "pacoca", "canudo", "ninho"], available: true, image: img("acai-pacoca") },
  { id: "tradicional", name: "Tradicional", toppingIds: ["leite-condensado", "banana", "amendoim", "ninho"], available: true },
  { id: "sensacao", name: "Sensação", toppingIds: ["leite-condensado", "morango", "confete", "nutella", "ninho"], available: true },
  { id: "kitkat", name: "Kit Kat", toppingIds: ["leite-condensado", "nutella", "kitkat", "ninho"], available: true },
  { id: "fit", name: "Fit Açaí", toppingIds: ["leite-condensado", "granola", "banana", "pasta-amendoim", "ninho"], available: true },
];
