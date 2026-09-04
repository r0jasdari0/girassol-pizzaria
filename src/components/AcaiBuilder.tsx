import { useMemo, useState } from "react";
import { acaiBases, acaiRecipes, acaiSizes, acaiToppings, available, byId } from "../data/products";
import { acaiExtrasCount, acaiFreeLeft, acaiFreeQuota, acaiPrice, mul, toppingPriceFor } from "../lib/pricing";
import { useCart } from "../store/cart";
import { usePrefs } from "../store/prefs";
import type { AcaiItem } from "../types";
import { AcaiPreview } from "./AcaiPreview";
import { Builder } from "./Builder";
import { CheckIcon } from "./Icons";
import { Price } from "./Price";
import { SizePicker } from "./SizePicker";

type Props = {
  initial?: Partial<Pick<AcaiItem, "baseId" | "sizeId" | "toppingIds" | "recipeId">>;
  editing?: AcaiItem;
  onClose: () => void;
};

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

export const AcaiBuilder = ({ initial, editing, onClose }: Props) => {
  const { t, tf, fmt } = usePrefs();
  const cart = useCart();
  const src = editing ?? initial ?? {};
  const [baseId, setBaseId] = useState(src.baseId ?? "acai");
  const [sizeId, setSizeId] = useState(src.sizeId ?? "a500");
  const [toppingIds, setToppingIds] = useState<string[]>(
    src.toppingIds ?? (src.recipeId ? byId(acaiRecipes, src.recipeId).toppingIds : []),
  );
  const [recipeId, setRecipeId] = useState<string | null>(src.recipeId ?? null);
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [qty, setQty] = useState(editing?.qty ?? 1);

  const unit = useMemo(() => acaiPrice(sizeId, toppingIds), [sizeId, toppingIds]);
  const quota = acaiFreeQuota(sizeId);
  const freeLeft = acaiFreeLeft(sizeId, toppingIds);
  const extras = acaiExtrasCount(sizeId, toppingIds);
  const isBarca = byId(acaiSizes, sizeId).kind === "barca";
  const recipe = recipeId ? byId(acaiRecipes, recipeId) : null;
  const recipeEdited = recipe ? !sameSet(recipe.toppingIds, toppingIds) : false;

  const pickRecipe = (id: string | null) => {
    setRecipeId(id);
    setToppingIds(id ? [...byId(acaiRecipes, id).toppingIds] : []);
  };

  const toggle = (id: string) =>
    setToppingIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = () => {
    if (editing) cart.update({ ...editing, baseId, sizeId, toppingIds, recipeId, qty, notes });
    else cart.add({ kind: "acai", baseId, sizeId, toppingIds, recipeId, qty, notes });
    onClose();
  };

  return (
    <Builder
      title={t.ab_title}
      accent="acai"
      onClose={onClose}
      stage={<AcaiPreview baseId={baseId} sizeId={sizeId} toppingIds={toppingIds} />}
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
      {/* 1 · Base */}
      <section className="bstep">
        <header className="bstep__head">
          <span className="bstep__num">1</span>
          <h3 className="bstep__title">{t.ab_step_base}</h3>
        </header>
        <div className="seg seg--2" role="radiogroup" aria-label={t.ab_step_base}>
          {available(acaiBases).map((b) => (
            <button key={b.id} type="button" role="radio" aria-checked={b.id === baseId} className={`seg__opt ${b.id === baseId ? "is-on" : ""}`} onClick={() => setBaseId(b.id)}>
              <span className="seg__swatch" style={{ background: b.color }} />
              {b.name}
            </button>
          ))}
        </div>
      </section>

      {/* 2 · Tamanho */}
      <section className="bstep">
        <header className="bstep__head">
          <span className="bstep__num">2</span>
          <h3 className="bstep__title">{t.ab_step_size}</h3>
          <span className="bstep__hint">{t.ab_free_note}</span>
        </header>
        <SizePicker
          label={t.ab_step_size}
          value={sizeId}
          onChange={setSizeId}
          options={available(acaiSizes).map((s) => ({
            id: s.id,
            name: s.name,
            meta: s.kind === "copo" ? t.ab_free_note : t.ab_barca_note,
            price: fmt(s.price),
            icon: <span className="sizechip__cup" style={{ ["--h" as string]: `${16 + (s.ml - 300) * 0.06}px` }} />,
          }))}
        />
      </section>

      {/* 3 · Receita */}
      <section className="bstep">
        <header className="bstep__head">
          <span className="bstep__num">3</span>
          <h3 className="bstep__title">{t.ab_step_recipe}</h3>
          <span className="bstep__hint">{t.ab_recipe_hint}</span>
        </header>
        <div className="chips chips--scroll" role="radiogroup" aria-label={t.ab_step_recipe}>
          <button type="button" role="radio" aria-checked={recipeId === null} className={`chip ${recipeId === null ? "is-on" : ""}`} onClick={() => pickRecipe(null)}>
            {t.ab_recipe_custom}
          </button>
          {available(acaiRecipes).map((r) => {
            const on = r.id === recipeId;
            return (
              <button key={r.id} type="button" role="radio" aria-checked={on} className={`chip ${on ? "is-on" : ""}`} onClick={() => pickRecipe(r.id)}>
                {r.name}
                {on && recipeEdited && <small>{t.ab_recipe_edited}</small>}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4 · Acompanhamentos */}
      <section className="bstep">
        <header className="bstep__head">
          <span className="bstep__num">4</span>
          <h3 className="bstep__title">{t.ab_step_toppings}</h3>
        </header>
        <p className={`bstep__status ${freeLeft === 0 ? "bstep__status--warn" : ""}`} aria-live="polite">
          {isBarca ? t.ab_barca_note : freeLeft > 0 ? tf("ab_free_left", { n: freeLeft }) : t.ab_free_used}
          {extras > 0 && ` · ${tf("ab_extras", { n: extras })}`}
        </p>
        <div className="pills">
          {available(acaiToppings).map((tp) => {
            const idx = toppingIds.indexOf(tp.id);
            const on = idx >= 0;
            const free = on ? idx < quota : freeLeft > 0;
            return (
              <button key={tp.id} type="button" className={`pill ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => toggle(tp.id)}>
                <span className="pill__swatch" style={{ background: tp.color }} />
                {on && <CheckIcon size={14} />}
                {tp.name}
                <small className={free ? "pill__free" : "pill__paid"}>{free ? t.free : `+${fmt(toppingPriceFor(sizeId, tp.id))}`}</small>
              </button>
            );
          })}
        </div>
      </section>

      <label className="field">
        <span className="field__label">{t.notes}</span>
        <textarea className="input input--area" placeholder={t.notes_ph_acai} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={200} rows={2} />
      </label>
    </Builder>
  );
};
