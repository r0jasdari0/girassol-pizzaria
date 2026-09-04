import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { usePrefs } from "../store/prefs";
import { CheckIcon, ChevronIcon } from "./Icons";

export type SizeOption = {
  id: string;
  name: string;
  meta: string;
  price: string;
  icon?: ReactNode;
};

type Props = {
  label: string;
  options: SizeOption[];
  value: string;
  onChange: (id: string) => void;
};

/**
 * Seletor de tamanho.
 * Celular: um resumo compacto do tamanho escolhido que abre uma lista vertical.
 * Desktop: tira de chips lado a lado.
 */
export const SizePicker = ({ label, options, value, onChange }: Props) => {
  const { t } = usePrefs();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.id === value) ?? options[0];

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <>
      {/* celular */}
      <div className={`sizepick ${open ? "is-open" : ""}`}>
        <button type="button" className="sizepick__summary" aria-expanded={open} aria-controls="sizepick-list" onClick={() => setOpen((o) => !o)}>
          {current.icon}
          <span className="sizepick__text">
            <span className="sizepick__name">{current.name}</span>
            <span className="sizepick__meta">{current.meta}</span>
          </span>
          <span className="sizepick__price">{current.price}</span>
          <span className="sizepick__change">
            {open ? t.close : t.size_change} <ChevronIcon size={16} className="sizepick__chev" />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="sizepick-list"
              className="sizepick__list"
              role="radiogroup"
              aria-label={label}
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {options.map((o) => {
                const on = o.id === value;
                return (
                  <button key={o.id} type="button" role="radio" aria-checked={on} className={`sizepick__opt ${on ? "is-on" : ""}`} onClick={() => pick(o.id)}>
                    {o.icon}
                    <span className="sizepick__text">
                      <span className="sizepick__name">{o.name}</span>
                      <span className="sizepick__meta">{o.meta}</span>
                    </span>
                    <span className="sizepick__price">{o.price}</span>
                    <span className="sizepick__check">{on && <CheckIcon size={14} />}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* desktop */}
      <div className="sizestrip sizestrip--desktop" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <button key={o.id} type="button" role="radio" aria-checked={on} className={`sizechip ${on ? "is-on" : ""}`} onClick={() => onChange(o.id)}>
              {o.icon}
              <span className="sizechip__name">{o.name}</span>
              <span className="sizechip__meta">{o.meta}</span>
              <span className="sizechip__price">{o.price}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
