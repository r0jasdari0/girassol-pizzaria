import { useMemo, useState } from "react";
import { available, byId, pizzaCrusts, pizzaFlavors, pizzaSizes } from "../data/products";
import { pad2 } from "../lib/format";
import { isFree, mul, pizzaPrice } from "../lib/pricing";
import { useCart } from "../store/cart";
import { usePrefs } from "../store/prefs";
import type { PizzaFlavorGroup, PizzaItem } from "../types";
import { Builder } from "./Builder";
import { CheckIcon, SearchIcon } from "./Icons";
import { PizzaPreview } from "./PizzaPreview";
import { Price } from "./Price";
import { SizePicker } from "./SizePicker";

type Props = {
  initial?: Partial<Pick<PizzaItem, "sizeId" | "flavorIds" | "crustId">>;
  /** Quando presente, o builder edita este item em vez de adicionar. */
  editing?: PizzaItem;
  onClose: () => void;
};

const groups: { id: PizzaFlavorGroup; key: "grp_salgada" | "grp_vip" | "grp_doce" | "grp_doce_vip" }[] = [
  { id: "salgada", key: "grp_salgada" },
  { id: "vip", key: "grp_vip" },
  { id: "doce", key: "grp_doce" },
  { id: "doce-vip", key: "grp_doce_vip" },
];

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const PizzaBuilder = ({ initial, editing, onClose }: Props) => {
  const { t, tf, fmt } = usePrefs();
  const cart = useCart();
  const src = editing ?? initial ?? {};
  const [sizeId, setSizeId] = useState(src.sizeId ?? "p35");
  const [flavorIds, setFlavorIds] = useState<string[]>(src.flavorIds ?? []);
  const [crustId, setCrustId] = useState(src.crustId ?? "sem");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [qty, setQty] = useState(editing?.qty ?? 1);
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState(false);

  const size = byId(pizzaSizes, sizeId);
  const atMax = flavorIds.length >= size.maxFlavors;
  const unit = useMemo(() => pizzaPrice(sizeId, flavorIds, crustId), [sizeId, flavorIds, crustId]);
  const sizes = available(pizzaSizes);
  const crusts = available(pizzaCrusts);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return available(pizzaFlavors);
    return available(pizzaFlavors).filter((f) => normalize(f.name).includes(q) || pad2(f.number) === q || String(f.number) === q);
  }, [query]);

  const changeSize = (id: string) => {
    setSizeId(id);
    const max = byId(pizzaSizes, id).maxFlavors;
    setFlavorIds((prev) => prev.slice(0, max));
  };

  const toggleFlavor = (id: string) => {
    setFlavorIds((prev) => {
      if (prev.includes(id)) return prev.filter((f) => f !== id);
      if (prev.length >= size.maxFlavors) return prev;
      return [...prev, id];
    });
  };

  const submit = () => {
    setTouched(true);
    if (flavorIds.length === 0) {
      document.getElementById("pb-flavors")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (editing) cart.update({ ...editing, sizeId, flavorIds, crustId, qty, notes });
    else cart.add({ kind: "pizza", sizeId, flavorIds, crustId, qty, notes });
    onClose();
  };

  const stageTitle =
    flavorIds.length >= size.maxFlavors
      ? tf("pb_selected", { a: flavorIds.length, b: size.maxFlavors })
      : size.maxFlavors === 1
        ? t.pb_choose_one
        : `${tf("pb_choose_up_to", { n: size.maxFlavors })} · ${flavorIds.length}/${size.maxFlavors}`;

  return (
    <Builder
      title={t.pb_title}
      accent="sun"
      onClose={onClose}
      stage={<PizzaPreview sizeId={sizeId} flavorIds={flavorIds} crustId={crustId} slots px={240} title={stageTitle} onRemove={toggleFlavor} />}
      qty={qty}
      onQty={setQty}
      onSubmit={submit}
      cta={
        <>
          <span>{editing ? t.save_changes : t.add_to_cart}</span>
          <Price value={mul(unit, qty)} />
        </>
      }
    >
      {/* 1 · Tamanho */}
      <section className="bstep">
        <header className="bstep__head">
          <span className="bstep__num">1</span>
          <h3 className="bstep__title">{t.pb_step_size}</h3>
        </header>
        <SizePicker
          label={t.pb_step_size}
          value={sizeId}
          onChange={changeSize}
          options={sizes.map((s) => ({
            id: s.id,
            name: s.name,
            meta: `${s.cm} cm · ${s.maxFlavors} ${s.maxFlavors === 1 ? t.flavor_one : t.flavor_many}`,
            price: fmt(s.price),
            icon: <span className="sizechip__ring" style={{ ["--d" as string]: `${18 + (s.cm - 25) * 1.2}px` }} />,
          }))}
        />
      </section>

      {/* Sabores: a escolha aparece no desenho da pizza, acima */}
      <section className="bstep bstep--flavors" id="pb-flavors" aria-label={t.pb_step_flavors}>
        {touched && flavorIds.length === 0 && <p className="field__error">{t.pb_need_flavor}</p>}

        <label className="search">
          <SearchIcon size={18} />
          <input
            type="search"
            className="search__input"
            placeholder={t.pb_search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputMode="search"
          />
        </label>

        {filtered.length === 0 && <p className="field__note">{t.pb_search_empty}</p>}
        {groups.map((g) => {
          const list = filtered.filter((f) => f.group === g.id);
          if (!list.length) return null;
          return (
            <div key={g.id} className="optgroup">
              <h4 className="optgroup__title">{t[g.key]}</h4>
              <ul className="flavorlist">
                {list.map((f) => {
                  const on = flavorIds.includes(f.id);
                  const disabled = !on && atMax;
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        className={`flavor ${on ? "is-on" : ""}`}
                        disabled={disabled}
                        aria-pressed={on}
                        onClick={() => toggleFlavor(f.id)}
                      >
                        <span className="flavor__num">{pad2(f.number)}</span>
                        <span className="flavor__text">
                          <span className="flavor__name">{f.name}</span>
                          {f.description && <span className="flavor__desc">{f.description}</span>}
                        </span>
                        <span className="flavor__side">
                          {!isFree(f.extra) && <span className="flavor__extra">+{fmt(f.extra)}</span>}
                          <span className="flavor__check">{on ? <CheckIcon size={14} /> : null}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        <p className="field__note">{t.pb_extra_rule}</p>
      </section>

      {/* 2 · Borda */}
      <section className="bstep">
        <header className="bstep__head">
          <span className="bstep__num">2</span>
          <h3 className="bstep__title">{t.pb_step_crust}</h3>
        </header>
        <div className="chips" role="radiogroup" aria-label={t.pb_step_crust}>
          {crusts.map((c) => {
            const on = c.id === crustId;
            return (
              <button key={c.id} type="button" role="radio" aria-checked={on} className={`chip ${on ? "is-on" : ""}`} onClick={() => setCrustId(c.id)}>
                <span className="chip__swatch" style={{ background: c.color }} />
                {c.name}
                <small>{isFree(c.price) ? t.free : `+${fmt(c.price)}`}</small>
              </button>
            );
          })}
        </div>
      </section>

      <label className="field">
        <span className="field__label">{t.notes}</span>
        <textarea className="input input--area" placeholder={t.notes_ph_pizza} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={200} rows={2} />
      </label>
    </Builder>
  );
};
