import { businessConfig } from "../config/business";
import { acaiBases, acaiSizes, acaiToppings, byId, pizzaCrusts, pizzaFlavors, pizzaSizes, simpleProducts } from "../data/products";
import { formatPrice } from "../store/prefs";
import type { CartItem, Currency, Order, Price } from "../types";
import { formatPhoneMsg, fractionAscii } from "./format";
import { deliveryFeeFor, hasDeliveryFee, lineTotal, orderTotal, subtotal } from "./pricing";

const RULE = "━━━━━━━━━━━━━━";

/** Preço na moeda escolhida pelo cliente, com a outra entre parênteses. */
const money = (p: Price, currency: Currency): string => {
  const other: Currency = currency === "BRL" ? "ARS" : "BRL";
  return `${formatPrice(p, currency)} (${formatPrice(p, other)})`;
};

const paymentLabel = (order: Order): string => {
  switch (order.payment.method) {
    case "pix":
      return "PIX";
    case "mercadopago":
      return "Mercado Pago";
    case "cartao":
      return "Cartão na entrega";
    case "dinheiro": {
      const troco = order.payment.changeFor.trim();
      return troco ? `Dinheiro — troco para ${troco}` : "Dinheiro — sem troco";
    }
    default:
      return "—";
  }
};

export const describeItem = (item: CartItem, currency: Currency): string[] => {
  const lines: string[] = [];
  if (item.kind === "pizza") {
    const size = byId(pizzaSizes, item.sizeId);
    const crust = byId(pizzaCrusts, item.crustId);
    lines.push(`🍕 *${item.qty}x Pizza ${size.name} ${size.cm}cm*`);
    lines.push("");
    lines.push(item.flavorIds.length > 1 ? "Sabores:" : "Sabor:");
    const frac = fractionAscii(item.flavorIds.length);
    for (const id of item.flavorIds) {
      const f = byId(pizzaFlavors, id);
      lines.push(`• ${frac}${String(f.number).padStart(2, "0")} ${f.name}`);
    }
    if (crust.price.brl > 0) {
      lines.push("");
      lines.push("Borda:");
      lines.push(`• ${crust.name}`);
    }
    if (item.notes.trim()) {
      lines.push("");
      lines.push(`Obs: ${item.notes.trim()}`);
    }
  } else if (item.kind === "acai") {
    const base = byId(acaiBases, item.baseId);
    const size = byId(acaiSizes, item.sizeId);
    lines.push(`🥣 *${item.qty}x ${base.name} ${size.ml}ml*`);
    if (item.toppingIds.length) {
      lines.push("");
      lines.push("Acompanhamentos:");
      for (const id of item.toppingIds) lines.push(`• ${byId(acaiToppings, id).name}`);
    }
    if (item.notes.trim()) {
      lines.push("");
      lines.push(`Obs: ${item.notes.trim()}`);
    }
  } else {
    const p = byId(simpleProducts, item.productId);
    const emoji = p.category === "bebidas" ? "🥤" : p.category === "combos" ? "🔥" : p.category === "carnes" ? "🥩" : "🍟";
    lines.push(`${emoji} *${item.qty}x ${p.name}${p.detail ? ` ${p.detail}` : ""}*`);
    if (p.includes?.length) {
      lines.push("");
      for (const inc of p.includes) lines.push(`• ${inc}`);
    }
  }
  lines.push("");
  lines.push(`Subtotal: ${money(lineTotal(item), currency)}`);
  return lines;
};

/** Monta a mensagem completa do pedido. */
export const buildOrderMessage = (order: Order): string => {
  const c = order.currency;
  const out: string[] = [];
  out.push(`🌻 *NOVO PEDIDO — ${businessConfig.shortName.toUpperCase()}*`);
  out.push("");
  out.push(`👤 *Cliente:* ${order.customer.name.trim()}`);
  out.push(`📞 *Telefone:* ${formatPhoneMsg(order.customer.phone)}`);

  for (const item of order.items) {
    out.push("");
    out.push(RULE);
    out.push("");
    out.push(...describeItem(item, c));
  }

  out.push("");
  out.push(RULE);
  out.push("");

  if (order.orderType === "entrega") {
    const a = order.address;
    out.push("🚚 *ENTREGA*");
    out.push("");
    out.push(`${a.street.trim()}, ${a.number.trim()}`);
    out.push(`Bairro: ${a.neighborhood.trim()}`);
    if (a.reference.trim()) out.push(`Referência: ${a.reference.trim()}`);
  } else {
    out.push("🏪 *RETIRADA NO BALCÃO*");
    out.push("");
    out.push(businessConfig.address);
  }

  out.push("");
  out.push(RULE);
  out.push("");
  out.push(`💳 *PAGAMENTO:* ${paymentLabel(order)}`);
  out.push(`💱 *Moeda:* ${c === "BRL" ? "Reais (R$)" : "Pesos ($)"}`);
  out.push("");
  out.push(RULE);
  out.push("");

  if (hasDeliveryFee(order.orderType)) {
    out.push(`Itens: ${money(subtotal(order.items), c)}`);
    out.push(`Taxa de entrega: ${money(deliveryFeeFor(order.orderType), c)}`);
    out.push("");
  }
  out.push("💰 *TOTAL*");
  out.push(money(orderTotal(order.items, order.orderType), c));

  return out.join("\n");
};

export const buildWhatsappUrl = (message: string): string =>
  `https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent(message)}`;

export const isMobileDevice = (): boolean => /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);

/**
 * Mobile: navega na mesma aba (abre o app do WhatsApp com confiabilidade).
 * Desktop: nova aba (WhatsApp Web); se o popup for bloqueado, navega na mesma aba.
 */
export const openWhatsapp = (url: string): void => {
  if (isMobileDevice()) {
    window.location.href = url;
    return;
  }
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = url;
};
