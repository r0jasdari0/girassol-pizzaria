import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { CartItem, NewCartItem } from "../types";

const STORAGE_KEY = "girassol.cart.v2";

type State = { items: CartItem[] };

type Action =
  | { type: "add"; item: CartItem }
  | { type: "update"; item: CartItem }
  | { type: "duplicate"; uid: string; newUid: string }
  | { type: "remove"; uid: string }
  | { type: "setQty"; uid: string; qty: number }
  | { type: "clear" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "add":
      return { items: [...state.items, action.item] };
    case "update":
      return { items: state.items.map((i) => (i.uid === action.item.uid ? action.item : i)) };
    case "duplicate": {
      const idx = state.items.findIndex((i) => i.uid === action.uid);
      if (idx < 0) return state;
      const copy = { ...state.items[idx], uid: action.newUid } as CartItem;
      const items = [...state.items];
      items.splice(idx + 1, 0, copy);
      return { items };
    }
    case "remove":
      return { items: state.items.filter((i) => i.uid !== action.uid) };
    case "setQty":
      if (action.qty <= 0) return { items: state.items.filter((i) => i.uid !== action.uid) };
      return { items: state.items.map((i) => (i.uid === action.uid ? { ...i, qty: Math.min(20, action.qty) } : i)) };
    case "clear":
      return { items: [] };
  }
};

const load = (): State => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as State;
    return Array.isArray(parsed.items) ? parsed : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const newUid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type CartApi = {
  items: CartItem[];
  add: (item: NewCartItem) => void;
  update: (item: CartItem) => void;
  duplicate: (uid: string) => void;
  remove: (uid: string) => void;
  setQty: (uid: string, qty: number) => void;
  clear: () => void;
  /** Incrementa quando algo é adicionado; a barra do carrinho usa para "pulsar". */
  pulse: number;
};

const CartContext = createContext<CartApi | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [pulse, setPulse] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* segue só em memória */
    }
  }, [state]);

  const add = useCallback((item: NewCartItem) => {
    dispatch({ type: "add", item: { ...item, uid: newUid() } as CartItem });
    setPulse((p) => p + 1);
  }, []);
  const update = useCallback((item: CartItem) => dispatch({ type: "update", item }), []);
  const duplicate = useCallback((uid: string) => {
    dispatch({ type: "duplicate", uid, newUid: newUid() });
    setPulse((p) => p + 1);
  }, []);
  const remove = useCallback((uid: string) => dispatch({ type: "remove", uid }), []);
  const setQty = useCallback((uid: string, qty: number) => dispatch({ type: "setQty", uid, qty }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const api = useMemo<CartApi>(
    () => ({ items: state.items, add, update, duplicate, remove, setQty, clear, pulse }),
    [state.items, add, update, duplicate, remove, setQty, clear, pulse],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
};

export const useCart = (): CartApi => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
};
