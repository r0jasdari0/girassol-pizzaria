import { img } from "../../lib/assets";
import type { PizzaCrust, PizzaFlavor, PizzaSize } from "../../types";

export const pizzaSizes: PizzaSize[] = [
  { id: "p25", name: "Pequena", cm: 25, maxFlavors: 1, price: { brl: 40, ars: 12000 }, available: true },
  { id: "p30", name: "Média", cm: 30, maxFlavors: 2, price: { brl: 50, ars: 15000 }, available: true },
  { id: "p35", name: "Grande", cm: 35, maxFlavors: 3, price: { brl: 60, ars: 18000 }, available: true },
  { id: "p40", name: "Gigante", cm: 40, maxFlavors: 4, price: { brl: 70, ars: 21000 }, available: true },
  { id: "p45", name: "Big", cm: 45, maxFlavors: 4, price: { brl: 80, ars: 24000 }, available: true },
];

export const pizzaCrusts: PizzaCrust[] = [
  { id: "sem", name: "Sem borda recheada", price: { brl: 0, ars: 0 }, color: "#D9A45B", available: true },
  { id: "cheddar", name: "Cheddar", price: { brl: 10, ars: 3000 }, color: "#F0A028", available: true },
  { id: "catupiry", name: "Catupiry", price: { brl: 10, ars: 3000 }, color: "#F6EFDA", available: true },
  { id: "chocolate", name: "Chocolate", price: { brl: 12, ars: 4000 }, color: "#5A3826", available: true },
  { id: "da-casa", name: "Da Casa", price: { brl: 15, ars: 5000 }, color: "#E8B34A", available: true },
];

const none = { brl: 0, ars: 0 };

const f = (
  number: number,
  id: string,
  name: string,
  description: string,
  group: PizzaFlavor["group"],
  color: string,
  bits: string,
): PizzaFlavor => ({
  id,
  number,
  name,
  description,
  group,
  extra: none,
  // No cardápio impresso as linhas VIP dizem "Consultar valores".
  priceOnRequest: group === "vip" || group === "doce-vip",
  color,
  bits,
  available: true,
  // Foto cenital gerada para o builder por fatias (public/images/pizzas/<id>.jpg).
  photo: img(`pizzas/${id}`),
});

const withImg = (fl: PizzaFlavor, photo: string): PizzaFlavor => ({ ...fl, image: img(photo) });

export const pizzaFlavors: PizzaFlavor[] = [
  // ── Salgadas ──
  f(1, "mussarela", "Mussarela", "Molho, mussarela e orégano.", "salgada", "#F5E3A1", "#E8C56A"),
  f(2, "marguerita", "Marguerita", "Molho, mussarela, tomate, alho e óleo, orégano.", "salgada", "#EBD58F", "#D9452F"),
  f(3, "calabresa", "Calabresa", "Molho, cebola, mussarela, calabresa, orégano.", "salgada", "#F1D98F", "#B5432B"),
  f(4, "calabresa-especial", "Calabresa Especial", "Molho, mussarela, calabresa, cheddar, orégano.", "salgada", "#EED28A", "#A33A24"),
  f(5, "atum", "Atum", "Molho, mussarela, atum, cebola, orégano.", "salgada", "#EFD9A0", "#8E7B6A"),
  f(6, "4-queijos", "4 Queijos", "Molho, mussarela, provolone, catupiry, cheddar, orégano.", "salgada", "#F7E7B0", "#E2A54A"),
  f(7, "5-queijos", "5 Queijos", "Molho, mussarela, provolone, catupiry, cheddar, parmesão e orégano.", "salgada", "#F8E9B8", "#D9994A"),
  f(8, "frango", "Frango", "Molho, frango, mussarela, orégano.", "salgada", "#F2E0B8", "#C9A26E"),
  withImg(f(9, "frango-catupiry", "Frango com Catupiry", "Molho, frango, mussarela, catupiry, orégano.", "salgada", "#F4E6C4", "#D9B27A"), "pizza-frango-catupiry"),
  f(10, "veneza", "Veneza", "Molho, frango, bacon, creme de leite, mussarela e orégano.", "salgada", "#F1DFB6", "#9A5A36"),
  f(11, "palmito", "Palmito", "Molho, mussarela, palmito, catupiry, orégano.", "salgada", "#F3E6C2", "#D8CBA3"),
  f(12, "lombo", "Lombo Canadense", "Molho, mussarela, lombo canadense, catupiry, orégano.", "salgada", "#F1DDB0", "#C4785A"),
  withImg(f(13, "portuguesa", "Portuguesa", "Molho, presunto, ervilha, ovo, cebola, azeitona, mussarela e orégano.", "salgada", "#EFD79A", "#C97A4A"), "pizza-portuguesa"),
  f(14, "gaucha", "Gaúcha", "Molho, presunto, calabresa, bacon, milho, ervilha, creme de leite, mussarela e orégano.", "salgada", "#EDD094", "#A54A32"),
  f(15, "bacon", "Bacon", "Molho, mussarela, bacon, orégano.", "salgada", "#F0D89A", "#8E4A2B"),
  f(16, "strogonoff-carne", "Strogonoff de Carne", "Molho, mussarela, carne de gado, creme de leite, batata palha e orégano.", "salgada", "#E4B98A", "#8C5A3C"),
  f(17, "strogonoff-frango", "Strogonoff de Frango", "Molho, mussarela, carne de frango, creme de leite, batata palha e orégano.", "salgada", "#EDD3A6", "#C99A62"),
  f(18, "milho", "Milho", "Molho, mussarela, milho e orégano.", "salgada", "#F5E3A1", "#F2C230"),
  f(19, "milho-bacon", "Milho com Bacon", "Molho, mussarela, milho, bacon e orégano.", "salgada", "#F1DB98", "#B0602F"),
  f(20, "file-cheddar", "Filé com Cheddar", "Molho, mussarela, filé, cheddar e orégano.", "salgada", "#EFC98A", "#7E4A2E"),
  f(21, "california", "Califórnia", "Molho, mussarela, bacon e abacaxi.", "salgada", "#F4E2A4", "#E7B93A"),
  f(22, "moda-chef", "Moda de Chef", "Molho, presunto, frango, calabresa, bacon, milho, palmito, mussarela e orégano.", "salgada", "#EDD094", "#B25A3A"),
  f(23, "moda-casa", "Moda da Casa", "Molho, presunto, calabresa, ovo, tomate, ervilha, cebola, mussarela e orégano.", "salgada", "#EED59B", "#C4553A"),
  f(24, "vegetariano", "Vegetariano", "Molho, mussarela, milho, ervilha, tomate, palmito, cebola e orégano.", "salgada", "#EEDFA6", "#6FA05A"),
  f(25, "presunto", "Presunto", "Molho, presunto, mussarela e orégano.", "salgada", "#F3E0A8", "#D98B7A"),
  f(26, "brocolis", "Brócolis", "Molho, mussarela, brócolis, catupiry e orégano.", "salgada", "#EFE2B4", "#4E8A3E"),
  f(27, "brocolis-especial", "Brócolis Especial", "Molho, mussarela, brócolis, bacon, milho e orégano.", "salgada", "#EDDEAE", "#5E8A3E"),
  f(28, "champignon", "Champignon", "Molho, mussarela, champignon, catupiry e orégano.", "salgada", "#F2E6C6", "#B79A7A"),
  // ── Salgadas VIP (valor sob consulta) ──
  f(29, "nachos", "Nachos", "Molho, mussarela, filé, pimentão, cheddar, Doritos e orégano.", "vip", "#F1D48A", "#D9822B"),
  f(30, "coracao", "Coração", "Molho, mussarela, coração, cebola e orégano.", "vip", "#EBC98E", "#8A3A2A"),
  f(31, "file-fritas", "Filé com Fritas", "Molho, mussarela, filé, creme de leite, cebola, orégano e batata frita.", "vip", "#F2D896", "#7E4A2E"),
  // ── Doces ──
  f(32, "banana", "Banana", "Mussarela, banana, leite condensado e canela.", "doce", "#EFD28C", "#B98748"),
  f(33, "dois-amores", "Dois Amores", "Leite condensado, chocolate preto e branco.", "doce", "#8B5A3C", "#F6EFDA"),
  f(34, "charge", "Charge", "Leite condensado, chocolate preto e amendoim.", "doce", "#5A3826", "#C9924A"),
  f(35, "sensacao", "Sensação", "Leite condensado, chocolate preto ou branco e morangos.", "doce", "#6B3A2A", "#D9452F"),
  withImg(f(36, "mm", "M&M", "Leite condensado, chocolate preto e M&M.", "doce", "#6B3A2A", "#E6B422"), "pizza-doce-mm"),
  f(37, "marshmallow", "Marshmallow", "Leite condensado, chocolate preto e marshmallow.", "doce", "#7A4A34", "#FFFFFF"),
  f(38, "doce-da-casa", "Da Casa", "Leite condensado, chocolate preto, M&M, amendoim e marshmallow.", "doce", "#7A4A34", "#F2C230"),
  f(39, "bis", "Bis", "Leite condensado, chocolate preto ou branco e Bis.", "doce", "#5A3826", "#3A2418"),
  f(40, "abacaxi", "Abacaxi", "Leite condensado, chocolate branco, abacaxi e creme de leite.", "doce", "#F4E2A4", "#E7B93A"),
  // ── Doces VIP (valor sob consulta) ──
  f(41, "prestigio", "Prestígio", "Leite condensado, chocolate branco e Prestígio branco.", "doce-vip", "#5A3826", "#FFFFFF"),
  f(42, "sensacao-branca-kiwi", "Sensação Branca com Kiwi", "Leite condensado, chocolate branco, morango e kiwi.", "doce-vip", "#F6EFDA", "#7BB35A"),
  f(43, "sonho-de-valsa", "Sonho de Valsa", "Leite condensado, chocolate preto e Sonho de Valsa.", "doce-vip", "#6B3A2A", "#C9924A"),
  f(44, "ouro-branco", "Ouro Branco", "Leite condensado, chocolate branco e Ouro Branco.", "doce-vip", "#F6EFDA", "#C9924A"),
  f(45, "pacoca", "Paçoca", "Leite condensado, chocolate branco e paçoca.", "doce-vip", "#E8C58A", "#B98748"),
];
