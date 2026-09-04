import { useEffect, useState } from "react";
import { acaiRecipes, acaiSizes, acaiToppings, available, byId, combos, drinks, meats, pizzaFlavors, pizzaSizes, portions } from "../data/products";
import { pad2 } from "../lib/format";
import { isFree } from "../lib/pricing";
import { useCart } from "../store/cart";
import { usePrefs } from "../store/prefs";
import type { PizzaFlavorGroup, SimpleProduct } from "../types";
import { siteImages } from "../data/images";
import { CheckIcon, ChevronIcon, PlusIcon } from "./Icons";

export type OpenBuilder =
  | { kind: "pizza"; sizeId?: string; flavorIds?: string[] }
  | { kind: "acai"; sizeId?: string; recipeId?: string };

type Props = { onOpen: (b: OpenBuilder) => void };

const groups: { id: PizzaFlavorGroup; key: "grp_salgada" | "grp_vip" | "grp_doce" | "grp_doce_vip" }[] = [
  { id: "salgada", key: "grp_salgada" },
  { id: "vip", key: "grp_vip" },
  { id: "doce", key: "grp_doce" },
  { id: "doce-vip", key: "grp_doce_vip" },
];

/** Botão "+" que confirma visualmente por 1,2 s depois de adicionar. */
const AddButton = ({ product }: { product: SimpleProduct }) => {
  const { t } = usePrefs();
  const cart = useCart();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1200);
    return () => clearTimeout(id);
  }, [done]);
  if (!product.available) return <span className="row__off">{t.unavailable}</span>;
  return (
    <button
      type="button"
      className={`addbtn ${done ? "is-done" : ""}`}
      aria-label={`${t.add} ${product.name}`}
      onClick={() => {
        cart.add({ kind: "simple", productId: product.id, qty: 1 });
        setDone(true);
      }}
    >
      {done ? <CheckIcon size={18} /> : <PlusIcon />}
    </button>
  );
};

const SimpleList = ({ items }: { items: SimpleProduct[] }) => {
  const { fmt } = usePrefs();
  return (
    <ul className="plist">
      {items.map((p) => (
        <li key={p.id} className={`prow ${p.available ? "" : "is-off"}`}>
          {p.image && <img className="prow__thumb" src={p.image} alt="" loading="lazy" width={64} height={64} />}
          <div className="prow__text">
            <span className="prow__name">
              {p.name}
              {p.detail && <span className="prow__detail">{p.detail}</span>}
            </span>
            {p.includes && <span className="prow__desc">{p.includes.join(" + ")}</span>}
            {p.description && <span className="prow__desc">{p.description}</span>}
          </div>
          <span className="prow__price">{fmt(p.price)}</span>
          <AddButton product={p} />
        </li>
      ))}
    </ul>
  );
};

export const Catalog = ({ onOpen }: Props) => {
  const { t, fmt } = usePrefs();
  const sizes = available(pizzaSizes);
  const flavors = available(pizzaFlavors);
  const featuredCombos = combos.filter((c) => c.featured);
  const otherCombos = combos.filter((c) => !c.featured);

  return (
    <main className="catalog" id="cardapio">
      {/* ── PIZZAS ── */}
      <section className="sec sec--pizzas" id="pizzas">
        <div className="sec__intro">
          <div>
            <span className="eyebrow eyebrow--red">{t.sec_pizzas_eyebrow}</span>
            <h2 className="sec__title">{t.sec_pizzas_title}</h2>
            <p className="sec__text">{t.sec_pizzas_text}</p>
            <button type="button" className="btn btn--ink" onClick={() => onOpen({ kind: "pizza" })}>
              {t.sec_pizzas_cta} <ChevronIcon size={16} />
            </button>
          </div>
          <div className="sec__art">
            <img className="sec__photo" src={siteImages.pizzaSection} alt="Pizza Portuguesa saindo do forno" loading="lazy" width={600} height={600} />
          </div>
        </div>

        <ul className="sizelist" aria-label={t.pb_step_size}>
          {sizes.map((s) => (
            <li key={s.id}>
              <button type="button" className="sizerow" onClick={() => onOpen({ kind: "pizza", sizeId: s.id })}>
                <span className="sizerow__text">
                  <span className="sizerow__name">{s.name}</span>
                  <span className="sizerow__meta">
                    {s.cm} cm · {s.maxFlavors} {s.maxFlavors === 1 ? t.flavor_one : t.flavor_many}
                  </span>
                </span>
                <span className="sizerow__price">{fmt(s.price)}</span>
                <ChevronIcon size={18} className="sizerow__chev" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flavors">
          <header className="flavors__head">
            <h3 className="sec__subtitle">{t.sec_flavors_title}</h3>
            <p className="sec__text">{t.sec_flavors_text}</p>
          </header>
          {groups.map((g) => {
            const list = flavors.filter((f) => f.group === g.id);
            if (!list.length) return null;
            return (
              <div key={g.id} className="flavors__group">
                <h4 className="flavors__gtitle">{t[g.key]}</h4>
                <ol className="flavors__list">
                  {list.map((f) => (
                    <li key={f.id}>
                      <button type="button" className="fl" onClick={() => onOpen({ kind: "pizza", flavorIds: [f.id] })}>
                        <span className="fl__num">{pad2(f.number)}</span>
                        <span className="fl__text">
                          <span className="fl__name">{f.name}</span>
                          {f.description && <span className="fl__desc">{f.description}</span>}
                        </span>
                        {f.priceOnRequest ? <span className="fl__extra fl__extra--ask">{t.on_request}</span> : !isFree(f.extra) && <span className="fl__extra">+{fmt(f.extra)}</span>}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AÇAÍ ── */}
      <section className="sec sec--acai" id="acai">
        <div className="sec__intro">
          <div>
            <span className="eyebrow eyebrow--light">{t.sec_acai_eyebrow}</span>
            <h2 className="sec__title">{t.sec_acai_title}</h2>
            <p className="sec__text">{t.sec_acai_text}</p>
            <button type="button" className="btn btn--sun" onClick={() => onOpen({ kind: "acai" })}>
              {t.sec_acai_cta} <ChevronIcon size={16} />
            </button>
          </div>
          <div className="sec__art">
            <img className="sec__photo sec__photo--acai" src={siteImages.acaiSection} alt="Açaí 500 ml com morango, banana e granola" loading="lazy" width={800} height={600} />
          </div>
        </div>
        <div className="sec__sizes">
          {available(acaiSizes).map((s) => (
            <button key={s.id} type="button" className={`cupchip ${s.kind === "barca" ? "cupchip--barca" : ""}`} onClick={() => onOpen({ kind: "acai", sizeId: s.id })}>
              <span className={s.kind === "barca" ? "cupchip__boat" : "cupchip__cup"} style={{ ["--h" as string]: `${28 + (s.ml - 300) * 0.06}px` }} />
              <span className="cupchip__name">{s.name.replace("Copo ", "")}</span>
              <span className="cupchip__price">{fmt(s.price)}</span>
            </button>
          ))}
        </div>

        <h3 className="sec__subtitle sec__subtitle--light">{t.sec_recipes_title}</h3>
        <div className="recipes">
          {available(acaiRecipes).map((r) => (
            <button key={r.id} type="button" className={`recipe ${r.image ? "has-img" : ""}`} onClick={() => onOpen({ kind: "acai", recipeId: r.id })}>
              {r.image && <img className="recipe__img" src={r.image} alt="" loading="lazy" width={400} height={400} />}
              <span className="recipe__dots" aria-hidden>
                {r.toppingIds.slice(0, 5).map((id) => (
                  <span key={id} style={{ background: byId(acaiToppings, id).color }} />
                ))}
              </span>
              <span className="recipe__name">{r.name}</span>
              <span className="recipe__list">{r.toppingIds.map((id) => byId(acaiToppings, id).name).join(", ")}</span>
              <span className="recipe__cta">
                {t.customize} <ChevronIcon size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── PORÇÕES ── */}
      <section className="sec" id="porcoes">
        <span className="eyebrow eyebrow--red">{t.sec_porcoes_eyebrow}</span>
        <h2 className="sec__title">{t.sec_porcoes_title}</h2>
        <SimpleList items={portions} />
      </section>

      {/* ── CARNES ── */}
      <section className="sec" id="carnes">
        <span className="eyebrow eyebrow--red">{t.sec_carnes_eyebrow}</span>
        <h2 className="sec__title">{t.sec_carnes_title}</h2>
        <SimpleList items={meats} />
      </section>

      {/* ── COMBOS ── */}
      <section className="sec sec--combos" id="combos">
        <span className="eyebrow eyebrow--red">{t.sec_combos_eyebrow}</span>
        <h2 className="sec__title">{t.sec_combos_title}</h2>
        <div className="combos">
          {featuredCombos.map((c) => (
            <article key={c.id} className="combo">
              {c.image && <img className="combo__img" src={c.image} alt="" loading="lazy" width={800} height={600} />}
              <header className="combo__head">
                <h3 className="combo__name">{c.name}</h3>
                <span className="combo__price">{fmt(c.price)}</span>
              </header>
              <ul className="combo__list">
                {c.includes?.map((inc, i) => (
                  <li key={inc}>
                    {i > 0 && <span className="combo__plus">+</span>}
                    {inc}
                  </li>
                ))}
              </ul>
              <AddButton product={c} />
            </article>
          ))}
        </div>
        <SimpleList items={otherCombos} />
      </section>

      {/* ── BEBIDAS ── */}
      <section className="sec" id="bebidas">
        <span className="eyebrow eyebrow--red">{t.sec_bebidas_eyebrow}</span>
        <h2 className="sec__title">{t.sec_bebidas_title}</h2>
        <SimpleList items={drinks} />
      </section>

      <footer className="catalog__foot">
        <p>{t.footer_note}</p>
      </footer>
    </main>
  );
};
