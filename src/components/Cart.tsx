import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { itemLines, itemTitle } from "../lib/describe";
import { itemCount, lineTotal, subtotal } from "../lib/pricing";
import { useCart } from "../store/cart";
import { usePrefs } from "../store/prefs";
import type { CartItem } from "../types";
import { BagIcon, CopyIcon, EditIcon, MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import { Price } from "./Price";
import { Sheet } from "./Sheet";

/** Barra fixa inferior (mobile). */
export const CartBar = ({ onOpen }: { onOpen: () => void }) => {
  const { t, tf } = usePrefs();
  const { items, pulse } = useCart();
  const reduce = useReducedMotion();
  const count = itemCount(items);
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div className="cartbar" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", stiffness: 380, damping: 32 }}>
          <motion.button
            type="button"
            className="cartbar__btn"
            onClick={onOpen}
            key={pulse}
            initial={reduce ? false : { scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <span className="cartbar__count" aria-label={tf("cart_items", { n: count })}>
              <BagIcon size={18} /> {count}
            </span>
            <span className="cartbar__label">{t.cart_view}</span>
            <Price value={subtotal(items)} className="cartbar__total" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type SheetProps = {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onEdit: (item: CartItem) => void;
};

export const CartSheet = ({ open, onClose, onCheckout, onEdit }: SheetProps) => {
  const { t, tf } = usePrefs();
  const { items, setQty, remove, duplicate } = useCart();
  const empty = items.length === 0;

  return (
    <Sheet
      open={open}
      eyebrow={t.cart_title}
      title={empty ? t.cart_empty_title : tf("cart_items", { n: itemCount(items) })}
      onClose={onClose}
      footer={
        empty ? undefined : (
          <div className="foot-col">
            <div className="totals">
              <span>{t.cart_subtotal}</span>
              <Price value={subtotal(items)} showOther className="totals__val" />
            </div>
            <button type="button" className="btn btn--ink btn--block btn--lg" onClick={onCheckout}>
              {t.cart_checkout}
            </button>
          </div>
        )
      }
    >
      {empty ? (
        <div className="empty">
          <p>{t.cart_empty_text}</p>
          <button type="button" className="btn btn--outline" onClick={onClose}>
            {t.cart_empty_cta}
          </button>
        </div>
      ) : (
        <ul className="cartlist">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.uid}
                className={`citem citem--${item.kind}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.18 }}
              >
                <div className="citem__main">
                  <span className="citem__title">{itemTitle(item)}</span>
                  {itemLines(item, t).map((l, i) => (
                    <span key={i} className="citem__line">
                      {l}
                    </span>
                  ))}
                  <div className="citem__actions">
                    {item.kind !== "simple" && (
                      <button type="button" className="linkbtn" onClick={() => onEdit(item)}>
                        <EditIcon size={14} /> {t.cart_edit}
                      </button>
                    )}
                    <button type="button" className="linkbtn" onClick={() => duplicate(item.uid)}>
                      <CopyIcon size={14} /> {t.cart_duplicate}
                    </button>
                    <button type="button" className="linkbtn linkbtn--danger" onClick={() => remove(item.uid)}>
                      <TrashIcon size={14} /> {t.cart_remove}
                    </button>
                  </div>
                </div>
                <div className="citem__side">
                  <Price value={lineTotal(item)} className="citem__price" />
                  <div className="stepper stepper--sm">
                    <button type="button" className="stepper__btn" aria-label={t.less} onClick={() => setQty(item.uid, item.qty - 1)}>
                      {item.qty === 1 ? <TrashIcon size={15} /> : <MinusIcon size={15} />}
                    </button>
                    <span className="stepper__val">{item.qty}</span>
                    <button type="button" className="stepper__btn" aria-label={t.more} onClick={() => setQty(item.uid, item.qty + 1)}>
                      <PlusIcon size={15} />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Sheet>
  );
};
