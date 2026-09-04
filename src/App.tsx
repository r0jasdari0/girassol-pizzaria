import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AcaiBuilder } from "./components/AcaiBuilder";
import { CartBar, CartSheet } from "./components/Cart";
import { Catalog, type OpenBuilder } from "./components/Catalog";
import { Checkout } from "./components/Checkout";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { PizzaBuilder } from "./components/PizzaBuilder";
import { CartProvider, useCart } from "./store/cart";
import { PrefsProvider } from "./store/prefs";
import type { AcaiItem, CartItem, PizzaItem } from "./types";

type BuilderState = ({ mode: "new" } & OpenBuilder) | { mode: "edit"; item: PizzaItem | AcaiItem } | null;

const Shell = () => {
  const [builder, setBuilder] = useState<BuilderState>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cart = useCart();

  const closeBuilder = () => setBuilder(null);
  const editItem = (item: CartItem) => {
    if (item.kind === "simple") return;
    setCartOpen(false);
    setBuilder({ mode: "edit", item });
  };

  return (
    <div className="app">
      <Nav onCart={() => setCartOpen(true)} />
      <Hero onBuild={() => setBuilder({ mode: "new", kind: "pizza" })} />
      <Catalog onOpen={(b) => setBuilder({ mode: "new", ...b })} />
      <CartBar onOpen={() => setCartOpen(true)} />

      <CartSheet
        open={cartOpen && !checkoutOpen}
        onClose={() => setCartOpen(false)}
        onEdit={editItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <AnimatePresence>
        {builder?.mode === "new" && builder.kind === "pizza" && (
          <PizzaBuilder key="pb" initial={{ sizeId: builder.sizeId, flavorIds: builder.flavorIds }} onClose={closeBuilder} />
        )}
        {builder?.mode === "new" && builder.kind === "acai" && (
          <AcaiBuilder key="ab" initial={{ sizeId: builder.sizeId, recipeId: builder.recipeId }} onClose={closeBuilder} />
        )}
        {builder?.mode === "edit" && builder.item.kind === "pizza" && (
          <PizzaBuilder
            key="pb-edit"
            editing={builder.item}
            onClose={() => {
              closeBuilder();
              setCartOpen(true);
            }}
          />
        )}
        {builder?.mode === "edit" && builder.item.kind === "acai" && (
          <AcaiBuilder
            key="ab-edit"
            editing={builder.item}
            onClose={() => {
              closeBuilder();
              setCartOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {checkoutOpen && (
        <Checkout
          onClose={() => {
            setCheckoutOpen(false);
            setCartOpen(true);
          }}
          onDone={() => {
            cart.clear();
            setCheckoutOpen(false);
            window.scrollTo({ top: 0 });
          }}
        />
      )}
    </div>
  );
};

export const App = () => (
  <PrefsProvider>
    <CartProvider>
      <Shell />
    </CartProvider>
  </PrefsProvider>
);
