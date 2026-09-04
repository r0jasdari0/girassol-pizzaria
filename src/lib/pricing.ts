import { businessConfig } from "../config/business";
import {
  acaiSizes,
  acaiToppings,
  byId,
  freeToppings,
  pizzaCrusts,
  pizzaFlavors,
  pizzaSizes,
  simpleProducts,
} from "../data/products";
import type { CartItem, OrderType, Price } from "../types";

export const ZERO: Price = { brl: 0, ars: 0 };
export const add = (a: Price, b: Price): Price => ({ brl: a.brl + b.brl, ars: a.ars + b.ars });
export const mul = (p: Price, n: number): Price => ({ brl: p.brl * n, ars: p.ars * n });
export const sum = (list: Price[]): Price => list.reduce(add, ZERO);
export const isFree = (p: Price): boolean => p.brl === 0 && p.ars === 0;

/** Pizza = tamanho + maior acréscimo entre os sabores + borda. */
export const pizzaPrice = (sizeId: string, flavorIds: string[], crustId: string): Price => {
  const size = byId(pizzaSizes, sizeId);
  const extras = flavorIds.map((id) => byId(pizzaFlavors, id).extra);
  const maxExtra = extras.reduce((m, e) => (e.brl > m.brl ? e : m), ZERO);
  return sum([size.price, maxExtra, byId(pizzaCrusts, crustId).price]);
};

/**
 * Açaí = tamanho + acompanhamentos além da cota grátis.
 * Os primeiros `freeToppings` escolhidos são grátis; os seguintes pagam o próprio preço.
 */
export const acaiPrice = (sizeId: string, toppingIds: string[]): Price => {
  const size = byId(acaiSizes, sizeId);
  if (size.kind === "barca") {
    return add(size.price, sum(toppingIds.map((id) => byId(acaiToppings, id).priceBarca)));
  }
  const paid = toppingIds.slice(freeToppings).map((id) => byId(acaiToppings, id).price);
  return add(size.price, sum(paid));
};

export const acaiFreeQuota = (sizeId: string): number => (byId(acaiSizes, sizeId).kind === "copo" ? freeToppings : 0);
export const acaiFreeLeft = (sizeId: string, toppingIds: string[]): number => Math.max(0, acaiFreeQuota(sizeId) - toppingIds.length);
export const acaiExtrasCount = (sizeId: string, toppingIds: string[]): number => Math.max(0, toppingIds.length - acaiFreeQuota(sizeId));
/** Preço do acompanhamento para o tamanho escolhido. */
export const toppingPriceFor = (sizeId: string, toppingId: string): Price => {
  const tp = byId(acaiToppings, toppingId);
  return byId(acaiSizes, sizeId).kind === "barca" ? tp.priceBarca : tp.price;
};

export const unitPrice = (item: CartItem): Price => {
  switch (item.kind) {
    case "pizza":
      return pizzaPrice(item.sizeId, item.flavorIds, item.crustId);
    case "acai":
      return acaiPrice(item.sizeId, item.toppingIds);
    case "simple":
      return byId(simpleProducts, item.productId).price;
  }
};

export const lineTotal = (item: CartItem): Price => mul(unitPrice(item), item.qty);
export const subtotal = (items: CartItem[]): Price => sum(items.map(lineTotal));
export const itemCount = (items: CartItem[]): number => items.reduce((s, i) => s + i.qty, 0);

export const deliveryFeeFor = (type: OrderType): Price => (type === "entrega" ? businessConfig.deliveryFee : ZERO);
export const hasDeliveryFee = (type: OrderType): boolean => !isFree(deliveryFeeFor(type));
export const orderTotal = (items: CartItem[], type: OrderType): Price => add(subtotal(items), deliveryFeeFor(type));
