import type { Price } from "../types";

/**
 * Configuração central do negócio.
 * Tudo que um painel administrativo controlaria no futuro vive aqui,
 * nunca dentro de componentes.
 */
export const businessConfig = {
  name: "Girassol Pizzaria & Açaí",
  shortName: "Girassol",

  /**
   * WhatsApp oficial em formato internacional, só dígitos.
   * +54 9 3741 41-5697 → "5493741415697"
   */
  whatsapp: "5493741415697",

  /** TODO: confirmar endereço e cidade. */
  address: "Av. Principal, 000 — Centro",
  city: "Bernardo de Irigoyen, Misiones",
  hours: "Ter a Dom · 18h às 23h",

  /** Taxa de entrega nas duas moedas. Zere as duas para não cobrar. */
  deliveryFee: { brl: 12, ars: 3500 } satisfies Price,

  deliveryEta: "40–60 min",
  pickupEta: "25–35 min",

  /** Moeda e idioma padrão para quem entra pela primeira vez. */
  defaultCurrency: "BRL" as const,
  defaultLang: "pt" as const,
};
