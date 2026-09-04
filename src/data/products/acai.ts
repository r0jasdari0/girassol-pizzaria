import { img } from "../../lib/assets";
import type { AcaiBase, AcaiRecipe, AcaiSize, AcaiTopping } from "../../types";

export const acaiBases: AcaiBase[] = [
  { id: "acai", name: "Açaí", color: "#4B1D5E", available: true },
  { id: "cupuacu", name: "Cupuaçu", color: "#F3E7C4", available: true },
];

/** Copos (até 3 acompanhamentos grátis) e barcas (adicionais cobrados à parte). Cardápio Girassol Açaí. */
export const acaiSizes: AcaiSize[] = [
  { id: "a300", name: "Copo 300 ml", kind: "copo", ml: 300, price: { brl: 18, ars: 5500 }, available: true },
  { id: "a400", name: "Copo 400 ml", kind: "copo", ml: 400, price: { brl: 23, ars: 7000 }, available: true },
  { id: "a500", name: "Copo 500 ml", kind: "copo", ml: 500, price: { brl: 28, ars: 8500 }, available: true },
  { id: "bp", name: "Barca P · 500 g", kind: "barca", ml: 500, price: { brl: 40, ars: 12000 }, available: true },
  { id: "bm", name: "Barca M · 700 g", kind: "barca", ml: 700, price: { brl: 50, ars: 14000 }, available: true },
  { id: "bg", name: "Barca G · 1 kg", kind: "barca", ml: 1000, price: { brl: 60, ars: 16000 }, available: true },
];

/** Quantos acompanhamentos entram grátis no copo. */
export const freeToppings = 3;

/**
 * Preços do cardápio: (copo BRL, copo ARS, barca BRL, barca ARS).
 * Fini e pasta de amendoim não constam na tabela do copo: valores assumidos.
 */
const t = (
  id: string,
  name: string,
  shape: AcaiTopping["shape"],
  color: string,
  cupBrl: number,
  cupArs: number,
  barcaBrl: number,
  barcaArs: number,
): AcaiTopping => ({
  id,
  name,
  shape,
  color,
  price: { brl: cupBrl, ars: cupArs },
  priceBarca: { brl: barcaBrl, ars: barcaArs },
  available: true,
});

export const acaiToppings: AcaiTopping[] = [
  t("leite-condensado", "Leite condensado", "drizzle", "#FFF6E0", 2, 1000, 4, 1200),
  t("ninho", "Leite em pó Ninho", "sprinkle", "#FFF9EC", 2, 1000, 4, 1500),
  t("nutella", "Nutella", "drizzle", "#4A2A18", 4, 2000, 8, 2500),
  t("confete", "Confete", "sprinkle", "#E6392B", 2.5, 1000, 3, 1500),
  t("morango", "Morango", "slice", "#D9273B", 3, 2000, 8, 2500),
  t("kiwi", "Kiwi", "slice", "#7BB35A", 3, 1000, 8, 2500),
  t("pacoca", "Paçoca", "chunk", "#C9A06A", 2, 1000, 6, 2000),
  t("banana", "Banana", "slice", "#F3E2A0", 2, 1000, 3, 1500),
  t("gominhas", "Gominhas", "chunk", "#F26A8D", 2, 1000, 3, 1500),
  t("ovomaltine", "Ovo Maltine", "sprinkle", "#8B5A3C", 4, 1000, 6, 2500),
  t("farofa-amendoim", "Farofa de amendoim", "sprinkle", "#D8B078", 2, 1000, 3, 1500),
  t("flocos-chocolate", "Flocos de chocolate", "sprinkle", "#3A2418", 2, 1000, 3, 1000),
  t("manga", "Manga", "chunk", "#F7B531", 3, 1000, 5, 1500),
  t("ouro-branco", "Ouro Branco", "chunk", "#F0E4C8", 3, 2000, 8, 2500),
  t("canudo", "Canudo", "chunk", "#C9924A", 2, 1000, 4, 1500),
  t("kitkat", "KitKat", "chunk", "#B3261E", 3, 1000, 8, 2500),
  t("bis", "Bis", "chunk", "#3A2418", 3, 1000, 6, 2500),
  t("marshmallow", "Marshmallow", "chunk", "#FFFFFF", 2.5, 1000, 4, 1500),
  t("amendoim", "Amendoim", "sprinkle", "#B98748", 2, 1000, 3, 1500),
  t("granola", "Granola", "sprinkle", "#A9803F", 4, 2000, 6, 2500),
  t("chantilly", "Chantilly", "cream", "#FFFFFF", 2, 1000, 6, 2000),
  t("sonho-de-valsa", "Sonho de Valsa", "chunk", "#8B1E2D", 3, 1000, 8, 2500),
  t("granulado", "Granulado", "sprinkle", "#4A2A18", 2, 1000, 2, 1000),
  t("chocoball", "Chocoball", "chunk", "#5A3826", 2, 1000, 3, 1000),
  t("abacaxi", "Abacaxi", "chunk", "#F4E2A4", 3, 1000, 5, 1500),
  t("fini", "Fini", "chunk", "#39B54A", 3, 1000, 8, 2000), // copo: valor assumido
  t("pasta-amendoim", "Pasta de amendoim", "drizzle", "#B4783C", 2, 1000, 4, 1500), // valor assumido
];

export const acaiRecipes: AcaiRecipe[] = [
  { id: "salada", name: "Salada de Açaí", toppingIds: ["leite-condensado", "morango", "banana", "manga", "kiwi", "ninho"], available: true, image: img("acai-salada") },
  { id: "pacoca", name: "Paçoca", toppingIds: ["leite-condensado", "pacoca", "canudo", "ninho"], available: true, image: img("acai-pacoca") },
  { id: "tradicional", name: "Tradicional", toppingIds: ["leite-condensado", "banana", "amendoim", "ninho"], available: true },
  { id: "sensacao", name: "Sensação", toppingIds: ["leite-condensado", "morango", "confete", "nutella", "ninho"], available: true },
  { id: "kitkat", name: "Kit Kat", toppingIds: ["leite-condensado", "nutella", "kitkat", "ninho"], available: true },
  { id: "fit", name: "Fit Açaí", toppingIds: ["leite-condensado", "granola", "banana", "pasta-amendoim", "ninho"], available: true },
];
