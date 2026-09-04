import { acaiBases, acaiSizes, acaiToppings, byId, pizzaCrusts, pizzaFlavors, pizzaSizes, simpleProducts } from "../data/products";
import type { Dict } from "../i18n/pt";
import type { CartItem } from "../types";
import { fraction } from "./format";

/** Título do item no carrinho e na revisão. */
export const itemTitle = (item: CartItem): string => {
  if (item.kind === "pizza") {
    const s = byId(pizzaSizes, item.sizeId);
    return `Pizza ${s.name} — ${s.cm} cm`;
  }
  if (item.kind === "acai") {
    const b = byId(acaiBases, item.baseId);
    const s = byId(acaiSizes, item.sizeId);
    return `${b.name} ${s.ml} ml`;
  }
  const p = byId(simpleProducts, item.productId);
  return p.detail ? `${p.name} · ${p.detail}` : p.name;
};

/** Linhas de detalhe: sabores com fração, borda, acompanhamentos, observações. */
export const itemLines = (item: CartItem, t: Dict): string[] => {
  const lines: string[] = [];
  if (item.kind === "pizza") {
    const frac = fraction(item.flavorIds.length);
    for (const id of item.flavorIds) lines.push(`${frac}${byId(pizzaFlavors, id).name}`);
    const crust = byId(pizzaCrusts, item.crustId);
    if (crust.price.brl > 0) lines.push(`${t.cart_crust}: ${crust.name}`);
    if (item.notes.trim()) lines.push(`${t.cart_obs}: ${item.notes.trim()}`);
  } else if (item.kind === "acai") {
    lines.push(item.toppingIds.length ? item.toppingIds.map((id) => byId(acaiToppings, id).name).join(", ") : t.cart_no_toppings);
    if (item.notes.trim()) lines.push(`${t.cart_obs}: ${item.notes.trim()}`);
  } else {
    const p = byId(simpleProducts, item.productId);
    if (p.includes?.length) lines.push(p.includes.join(" + "));
  }
  return lines;
};
