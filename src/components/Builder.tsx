import { motion, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { usePrefs } from "../store/prefs";
import { BackIcon, MinusIcon, PlusIcon } from "./Icons";

type Props = {
  title: string;
  accent: "sun" | "acai";
  onClose: () => void;
  /** Desenho do produto (pizza / copo). */
  stage: ReactNode;
  /** Opções de configuração. */
  children: ReactNode;
  qty: number;
  onQty: (q: number) => void;
  cta: ReactNode;
  onSubmit: () => void;
};

/**
 * Casca dos builders: tela cheia, palco do produto + painel de opções.
 * Mobile: palco em cima, opções embaixo, CTA fixa. Desktop: duas colunas.
 */
export const Builder = ({ title, accent, onClose, stage, children, qty, onQty, cta, onSubmit }: Props) => {
  const { t } = usePrefs();
  const reduce = useReducedMotion();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className={`builder builder--${accent}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 24 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <header className="builder__head">
        <button type="button" className="iconbtn" aria-label={t.back} onClick={onClose}>
          <BackIcon />
        </button>
        <h2 className="builder__title">{title}</h2>
      </header>

      <div className="builder__stage">{stage}</div>

      <div className="builder__panel">{children}</div>

      <footer className="builder__foot">
        <div className="stepper" aria-label={t.qty}>
          <button type="button" className="stepper__btn" onClick={() => onQty(Math.max(1, qty - 1))} aria-label={t.less}>
            <MinusIcon />
          </button>
          <span className="stepper__val">{qty}</span>
          <button type="button" className="stepper__btn" onClick={() => onQty(Math.min(20, qty + 1))} aria-label={t.more}>
            <PlusIcon />
          </button>
        </div>
        <button type="button" className={`btn btn--${accent === "acai" ? "acai" : "ink"} btn--grow btn--cta`} onClick={onSubmit}>
          {cta}
        </button>
      </footer>
    </motion.div>
  );
};
