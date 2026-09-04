import { img } from "../../lib/assets";
import type { SimpleProduct } from "../../types";

/** Fotos em public/images/<id>.jpg. Produtos sem foto ficam sem imagem (a interface lida com isso). */
const photos: Record<string, string> = {
  batata: "batata",
  mandioquinha: "mandioquinha",
  polenta: "polenta",
  "anel-cebola": "anel-cebola",
  "batata-cheddar-bacon": "batata-cheddar-bacon",
  "tilapia-fritas": "tilapia-fritas",
  "frango-passarinho-600": "frango-passarinho",
  coracaozinho: "coracaozinho",
  "filezinho-tilapia": "filezinho-tilapia",
  "calabresa-acebolada": "calabresa-acebolada",
  "peito-frango": "peito-frango",
  "frango-passarinho-carnes": "frango-passarinho",
  "contra-file": "contra-file",
  "combo-1": "combo-1",
  "combo-2": "combo-2",
  "girassol-familia": "girassol-familia",
  "refri-225": "refri-225",
  "refri-15": "refri-225",
  "refri-lata": "refri-lata",
  agua: "agua",
  suco: "suco",
};

const p = (
  category: SimpleProduct["category"],
  id: string,
  name: string,
  detail: string | undefined,
  brl: number,
  ars: number,
  extra: Partial<SimpleProduct> = {},
): SimpleProduct => ({
  id,
  category,
  name,
  detail,
  description: "",
  price: { brl, ars },
  available: true,
  image: photos[id] ? img(photos[id]) : undefined,
  ...extra,
});

export const portions: SimpleProduct[] = [
  p("porcoes", "batata", "Batata frita", "600g", 25, 8000),
  p("porcoes", "mandioquinha", "Mandioquinha frita", "600g", 25, 8000),
  p("porcoes", "polenta", "Polenta frita", "600g", 25, 8000),
  p("porcoes", "anel-cebola", "Anel de cebola", "400g", 25, 8000),
  p("porcoes", "batata-cheddar-bacon", "Batata frita com cheddar e bacon", "600g", 40, 12000, { featured: true }),
  p("porcoes", "tilapia-fritas", "Tilápia com fritas", "400g", 70, 20000),
  p("porcoes", "frango-passarinho-600", "Frango a passarinho", "600g", 65, 18000),
];

export const meats: SimpleProduct[] = [
  p("carnes", "coracaozinho", "Coraçãozinho", "300g", 30, 9000),
  p("carnes", "filezinho-tilapia", "Filézinho de tilápia", "400g", 40, 12000),
  p("carnes", "calabresa-acebolada", "Calabresa acebolada", "300g", 20, 6000),
  p("carnes", "peito-frango", "Peito de frango acebolado", "400g", 25, 7000),
  p("carnes", "frango-passarinho-carnes", "Frango a passarinho", "600g", 40, 12000),
  p("carnes", "contra-file", "Contra filé", "400g", 60, 17000),
];

export const combos: SimpleProduct[] = [
  p("combos", "combo-1", "Combo 1", undefined, 105, 33000, {
    featured: true,
    includes: ["Pizza Big 45 cm", "Pizza doce pequena 25 cm", "Refrigerante 2,25 L"],
  }),
  p("combos", "combo-2", "Combo 2", undefined, 95, 30000, {
    featured: true,
    includes: ["Pizza Grande 35 cm", "Pizza doce pequena 25 cm", "Refrigerante 1,5 L"],
  }),
  p("combos", "girassol-familia", "Girassol Família", undefined, 125, 36000),
  p("combos", "mixta", "Mixta", undefined, 105, 30000),
  p("combos", "picanha", "Picanha", undefined, 95, 28000),
  p("combos", "file", "Filé", undefined, 90, 27000),
  p("combos", "da-casa", "Da Casa", undefined, 85, 25000),
];

/** TODO: bebidas e preços não constam no cardápio recebido — valores provisórios. */
export const drinks: SimpleProduct[] = [
  p("bebidas", "refri-225", "Refrigerante", "2,25 L", 15, 4500),
  p("bebidas", "refri-15", "Refrigerante", "1,5 L", 12, 3500),
  p("bebidas", "refri-lata", "Refrigerante", "Lata 350 ml", 6, 1800),
  p("bebidas", "agua", "Água mineral", "500 ml", 4, 1200),
  p("bebidas", "suco", "Suco natural", "500 ml", 10, 3000),
];

export const simpleProducts: SimpleProduct[] = [...portions, ...meats, ...combos, ...drinks];
