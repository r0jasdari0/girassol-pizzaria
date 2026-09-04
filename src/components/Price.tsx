import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePrefs } from "../store/prefs";
import type { Price as PriceT } from "../types";

type Props = { value: PriceT; className?: string; showOther?: boolean; prefix?: string };

/** Preço na moeda ativa. Anima a troca de valor (desliza para cima). */
export const Price = ({ value, className = "", showOther = false, prefix }: Props) => {
  const { fmt, fmtOther } = usePrefs();
  const reduce = useReducedMotion();
  const text = fmt(value);
  return (
    <span className={`price ${className}`}>
      {prefix && <span className="price__prefix">{prefix} </span>}
      <span className="price__roll">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="price__val"
            initial={reduce ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -12, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </span>
      {showOther && <small className="price__other">{fmtOther(value)}</small>}
    </span>
  );
};
