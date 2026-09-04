import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { usePrefs } from "../store/prefs";
import { CloseIcon } from "./Icons";

type Props = {
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
};

/** Painel inferior (mobile) / cartão central (desktop). */
export const Sheet = ({ open, title, eyebrow, onClose, footer, children }: Props) => {
  const { t } = usePrefs();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <header className="sheet__head">
              <div>
                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                <h2 className="sheet__title">{title}</h2>
              </div>
              <button type="button" className="iconbtn" aria-label={t.close} onClick={onClose}>
                <CloseIcon />
              </button>
            </header>
            <div className="sheet__body">{children}</div>
            {footer && <footer className="sheet__foot">{footer}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
