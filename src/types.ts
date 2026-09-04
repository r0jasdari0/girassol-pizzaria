/** Preço sempre nas duas moedas. A interface mostra uma por vez. */
export type Price = { brl: number; ars: number };

export type Currency = "BRL" | "ARS";
export type Lang = "pt" | "es";

export type Category = "pizzas" | "acai" | "porcoes" | "carnes" | "combos" | "bebidas";

/** Produto simples (porções, carnes, combos, bebidas): escolhe e adiciona. */
export type SimpleProduct = {
  id: string;
  category: Exclude<Category, "pizzas" | "acai">;
  name: string;
  description: string;
  /** Peso/volume exibido junto ao nome, ex.: "600g", "2,25 L". */
  detail?: string;
  price: Price;
  image?: string;
  available: boolean;
  /** Combos: lista do que vem dentro. */
  includes?: string[];
  featured?: boolean;
};

// ── Pizza ────────────────────────────────────────────────────────
export type PizzaSize = {
  id: string;
  name: string;
  cm: number;
  maxFlavors: number;
  price: Price;
  available: boolean;
};

export type PizzaFlavorGroup = "salgada" | "vip" | "doce" | "doce-vip";

export type PizzaFlavor = {
  id: string;
  /** Número no cardápio impresso (01–45). O cliente pede por número. */
  number: number;
  name: string;
  description: string;
  group: PizzaFlavorGroup;
  /** Acréscimo sobre o tamanho. Vale o maior entre os sabores escolhidos. */
  extra: Price;
  /** Cores do desenho: massa/cobertura e "pedaços". */
  color: string;
  bits: string;
  available: boolean;
  image?: string;
  /** Foto da pizza inteira vista de cima, centrada. Usada no builder por fatias. */
  photo?: string;
  /** Linhas VIP: valor sob consulta (não entra no total). */
  priceOnRequest?: boolean;
};

export type PizzaCrust = {
  id: string;
  name: string;
  price: Price;
  /** Cor da borda no desenho. */
  color: string;
  available: boolean;
};

// ── Açaí / Cupuaçu ───────────────────────────────────────────────
export type AcaiBase = { id: string; name: string; color: string; available: boolean };

export type AcaiSize = {
  id: string;
  name: string;
  /** Copo (ml) ou barca (g). */
  kind: "copo" | "barca";
  ml: number;
  price: Price;
  available: boolean;
};

export type AcaiTopping = {
  id: string;
  name: string;
  /** Preço no copo, quando vai além da cota grátis. */
  price: Price;
  /** Preço como adicional na barca (sempre cobrado). */
  priceBarca: Price;
  /** Cor no desenho do copo. */
  color: string;
  /** Forma no desenho. */
  shape: "drizzle" | "chunk" | "sprinkle" | "slice" | "cream";
  available: boolean;
};

export type AcaiRecipe = {
  id: string;
  name: string;
  toppingIds: string[];
  available: boolean;
  image?: string;
};

// ── Carrinho ─────────────────────────────────────────────────────
export type PizzaItem = {
  kind: "pizza";
  uid: string;
  sizeId: string;
  flavorIds: string[];
  crustId: string;
  qty: number;
  notes: string;
};

export type AcaiItem = {
  kind: "acai";
  uid: string;
  baseId: string;
  sizeId: string;
  toppingIds: string[];
  recipeId: string | null;
  qty: number;
  notes: string;
};

export type SimpleItem = {
  kind: "simple";
  uid: string;
  productId: string;
  qty: number;
};

export type CartItem = PizzaItem | AcaiItem | SimpleItem;

/** Item sem uid: o que os builders entregam ao carrinho. */
export type NewCartItem = CartItem extends infer T ? (T extends CartItem ? Omit<T, "uid"> : never) : never;

// ── Checkout ─────────────────────────────────────────────────────
export type OrderType = "entrega" | "retirada";
export type PaymentMethod = "dinheiro" | "pix" | "transferencia";

export type Customer = { name: string };
export type Payment = { method: PaymentMethod | null; changeFor: string };

export type Order = {
  customer: Customer;
  orderType: OrderType;
  payment: Payment;
  currency: Currency;
  items: CartItem[];
};
