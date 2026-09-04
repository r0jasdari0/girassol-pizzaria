import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { itemCount } from "../lib/pricing";
import { useCart } from "../store/cart";
import { usePrefs } from "../store/prefs";
import { FlagAR, FlagBR } from "./Flags";
import { BagIcon, SunflowerMark } from "./Icons";

const links = [
  { href: "#pizzas", key: "nav_pizzas" },
  { href: "#acai", key: "nav_acai" },
  { href: "#porcoes", key: "nav_porcoes" },
  { href: "#combos", key: "nav_combos" },
  { href: "#cardapio", key: "nav_menu" },
] as const;

export const Nav = ({ onCart }: { onCart: () => void }) => {
  const { t, lang, setLang, currency, setCurrency } = usePrefs();
  const { items, pulse } = useCart();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  /** Se existir public/logo.png (o logotipo oficial), usa ele; senão, a marca em SVG. */
  const [logoOk, setLogoOk] = useState(true);
  const count = itemCount(items);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" aria-label="Girassol">
          {logoOk ? (
            <img className="nav__logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="Girassol Pizzaria" onError={() => setLogoOk(false)} />
          ) : (
            <>
              <SunflowerMark size={30} />
              <span>Girassol</span>
            </>
          )}
        </a>

        <nav className="nav__links" aria-label="Seções">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {t[l.key]}
            </a>
          ))}
        </nav>

        <div className="nav__tools">
          <div className="toggle" role="group" aria-label={t.lang_label}>
            <button type="button" className={lang === "pt" ? "is-on" : ""} onClick={() => setLang("pt")} aria-pressed={lang === "pt"}>
              <FlagBR /> PT
            </button>
            <button type="button" className={lang === "es" ? "is-on" : ""} onClick={() => setLang("es")} aria-pressed={lang === "es"}>
              <FlagAR /> ES
            </button>
          </div>
          <div className="toggle" role="group" aria-label={t.currency_label}>
            <button type="button" className={currency === "BRL" ? "is-on" : ""} onClick={() => setCurrency("BRL")} aria-pressed={currency === "BRL"}>
              R$
            </button>
            <button type="button" className={currency === "ARS" ? "is-on" : ""} onClick={() => setCurrency("ARS")} aria-pressed={currency === "ARS"}>
              $ ARS
            </button>
          </div>
          <motion.button
            type="button"
            className="nav__cart"
            onClick={onCart}
            aria-label={`${t.nav_cart}: ${count}`}
            key={pulse}
            initial={reduce || pulse === 0 ? false : { scale: 1.18 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <BagIcon size={20} />
            {count > 0 && <span className="nav__count">{count}</span>}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
