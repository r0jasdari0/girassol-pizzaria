import { img } from "../lib/assets";

/** Fotos de seção (não são de um produto específico). */
export const siteImages = {
  heroPizza: img("hero-pizza-square"),
  pizzaSection: img("pizza-portuguesa"),
  acaiSection: img("acai-500"),
  cupuacu: img("cupuacu-500"),
  /** Logotipo oficial com fundo transparente (public/images/logo-girassol.png). */
  logo: `${import.meta.env.BASE_URL}images/logo-girassol.png`,
} as const;
