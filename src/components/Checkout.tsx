import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { businessConfig } from "../config/business";
import { itemLines, itemTitle } from "../lib/describe";
import { deliveryFeeFor, hasDeliveryFee, itemCount, lineTotal, orderTotal, subtotal } from "../lib/pricing";
import { buildOrderMessage, buildWhatsappUrl, openWhatsapp } from "../lib/whatsapp";
import { useCart } from "../store/cart";
import { usePrefs } from "../store/prefs";
import type { Customer, Order, OrderType, Payment, PaymentMethod } from "../types";
import { FlagAR, FlagBR } from "./Flags";
import { BackIcon, BikeIcon, CheckIcon, CopyIcon, EditIcon, StoreIcon, WhatsappIcon } from "./Icons";
import { Price } from "./Price";

type Step = 0 | 1 | 2;
const KEY_CUSTOMER = "girassol.customer.v3";
const KEY_TYPE = "girassol.ordertype.v2";

const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<T>) } : fallback;
  } catch {
    return fallback;
  }
};
const saveJson = (key: string, v: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignora */
  }
};

type Props = { onClose: () => void; onDone: () => void };

export const Checkout = ({ onClose, onDone }: Props) => {
  const { t, tf, fmt, currency, setCurrency } = usePrefs();
  const { items } = useCart();
  const [step, setStep] = useState<Step>(0);
  const [customer, setCustomer] = useState<Customer>(() => loadJson(KEY_CUSTOMER, { name: "" }));
  const [orderType, setOrderType] = useState<OrderType>(() => loadJson(KEY_TYPE, { v: "entrega" as OrderType }).v);
  const [payment, setPayment] = useState<Payment>({ method: null, changeFor: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ url: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => saveJson(KEY_CUSTOMER, customer), [customer]);
  useEffect(() => saveJson(KEY_TYPE, { v: orderType }), [orderType]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  // Trocar de moeda invalida a forma de pagamento (PIX só em reais, transferência só em pesos).
  useEffect(() => {
    setPayment((p) => {
      if (p.method === "pix" && currency === "ARS") return { ...p, method: null };
      if (p.method === "transferencia" && currency === "BRL") return { ...p, method: null };
      return p;
    });
  }, [currency]);

  const STEPS = [t.co_step_data, t.co_step_payment, t.co_step_review];

  const order: Order = useMemo(
    () => ({ customer, orderType, payment, currency, items }),
    [customer, orderType, payment, currency, items],
  );
  const message = useMemo(() => buildOrderMessage(order), [order]);
  const total = orderTotal(items, orderType);
  const fee = hasDeliveryFee(orderType);

  const validate = (s: Step): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0 && customer.name.trim().length < 2) e.name = t.co_err_name;
    if (s === 1 && !payment.method) e.payment = t.co_err_payment;
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      bodyRef.current?.querySelector<HTMLElement>("[data-error]")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setStep((s) => Math.min(2, s + 1) as Step);
  };
  const back = () => (step === 0 ? onClose() : setStep((s) => Math.max(0, s - 1) as Step));
  const goTo = (s: Step) => {
    setErrors({});
    setStep(s);
  };

  const send = () => {
    const all = { ...validate(0), ...validate(1) };
    if (items.length === 0) all.items = t.co_err_empty;
    if (Object.keys(all).length) {
      setErrors(all);
      if (all.name) goTo(0);
      else if (all.payment) goTo(1);
      return;
    }
    const url = buildWhatsappUrl(message);
    setSent({ url, message });
    openWhatsapp(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  // Formas de pagamento dependem da moeda: reais → Dinheiro / PIX; pesos → Efectivo / Transferencia.
  const payOptions: { id: PaymentMethod; label: string; desc: string }[] =
    currency === "BRL"
      ? [
          { id: "dinheiro", label: t.pay_dinheiro, desc: t.pay_dinheiro_desc },
          { id: "pix", label: t.pay_pix, desc: t.pay_pix_desc },
        ]
      : [
          { id: "dinheiro", label: t.pay_dinheiro, desc: t.pay_dinheiro_desc },
          { id: "transferencia", label: t.pay_transferencia, desc: t.pay_transferencia_desc },
        ];
  const payLabel = payOptions.find((p) => p.id === payment.method)?.label ?? "";

  if (sent) {
    return (
      <div className="checkout">
        <header className="checkout__head">
          <button type="button" className="iconbtn" aria-label={t.back} onClick={() => setSent(null)}>
            <BackIcon />
          </button>
          <h2 className="checkout__title">{t.co_done_header}</h2>
        </header>
        <div className="checkout__body" ref={bodyRef}>
          <div className="done">
            <span className="done__icon">
              <WhatsappIcon size={34} />
            </span>
            <h3 className="done__title">{t.co_done_title}</h3>
            <p className="done__text">{t.co_done_text}</p>
            {orderType === "entrega" && (
              <p className="done__loc">
                <BikeIcon size={18} /> {t.co_done_location}
              </p>
            )}
            <a className="btn btn--wa btn--block btn--lg" href={sent.url} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon size={20} /> {t.co_done_open}
            </a>
            <button type="button" className="btn btn--outline btn--block" onClick={copy}>
              <CopyIcon size={16} /> {copied ? t.co_done_copied : t.co_done_copy}
            </button>
            <button type="button" className="btn btn--text btn--block" onClick={onDone}>
              {t.co_done_new}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <header className="checkout__head">
        <button type="button" className="iconbtn" aria-label={step === 0 ? t.co_back_to_cart : t.co_prev_step} onClick={back}>
          <BackIcon />
        </button>
        <h2 className="checkout__title">{STEPS[step]}</h2>
        <span className="checkout__stepnum">
          {step + 1}/{STEPS.length}
        </span>
      </header>

      <ol className="steps steps--3">
        {STEPS.map((label, i) => (
          <li key={label} className={`steps__item ${i === step ? "is-current" : ""} ${i < step ? "is-done" : ""}`}>
            <button type="button" className="steps__btn" onClick={() => i < step && goTo(i as Step)} disabled={i > step}>
              <span className="steps__dot">{i < step ? <CheckIcon size={12} /> : i + 1}</span>
              <span className="steps__label">{label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="checkout__body" ref={bodyRef}>
        {step === 0 && (
          <section className="stepview">
            <p className="stepview__lead">{t.co_lead_data}</p>
            <Field label={t.co_name} error={errors.name}>
              <input
                className="input input--lg"
                type="text"
                autoComplete="name"
                placeholder={t.co_name_ph}
                value={customer.name}
                onChange={(e) => setCustomer({ name: e.target.value })}
                autoFocus
              />
            </Field>

            <div className="field">
              <span className="field__label">{t.co_type_label}</span>
              <div className="choice">
                <button type="button" className={`choice__opt ${orderType === "entrega" ? "is-on" : ""}`} aria-pressed={orderType === "entrega"} onClick={() => setOrderType("entrega")}>
                  <BikeIcon />
                  <span className="choice__name">{t.co_delivery}</span>
                  <span className="choice__meta">
                    {businessConfig.deliveryEta}
                    {hasDeliveryFee("entrega") ? ` · ${fmt(deliveryFeeFor("entrega"))}` : ""}
                  </span>
                </button>
                <button type="button" className={`choice__opt ${orderType === "retirada" ? "is-on" : ""}`} aria-pressed={orderType === "retirada"} onClick={() => setOrderType("retirada")}>
                  <StoreIcon />
                  <span className="choice__name">{t.co_pickup}</span>
                  <span className="choice__meta">
                    {businessConfig.pickupEta} · {t.co_no_fee}
                  </span>
                </button>
              </div>
            </div>

            {orderType === "retirada" ? (
              <div className="card card--red">
                <span className="eyebrow">{t.co_pickup_at}</span>
                <p className="card__big">{businessConfig.address}</p>
                <p className="card__text">
                  {businessConfig.city} · {businessConfig.hours}
                </p>
              </div>
            ) : (
              <div className="card card--wa">
                <span className="eyebrow">
                  <WhatsappIcon size={14} /> {t.co_location_title}
                </span>
                <p className="card__text card__text--dark">{t.co_location_note}</p>
              </div>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="stepview">
            <p className="stepview__lead">{t.co_lead_payment}</p>

            <div className="field">
              <span className="field__label">{t.co_currency}</span>
              <div className="seg seg--2">
                <button type="button" className={`seg__opt ${currency === "BRL" ? "is-on" : ""}`} onClick={() => setCurrency("BRL")}>
                  <FlagBR /> Reais · R$
                </button>
                <button type="button" className={`seg__opt ${currency === "ARS" ? "is-on" : ""}`} onClick={() => setCurrency("ARS")}>
                  <FlagAR /> Pesos · $
                </button>
              </div>
            </div>

            {errors.payment && (
              <p className="field__error" data-error>
                {errors.payment}
              </p>
            )}
            {payOptions.map((o) => {
              const on = payment.method === o.id;
              return (
                <button key={o.id} type="button" className={`opt opt--radio ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => setPayment({ ...payment, method: o.id })}>
                  <span className="opt__box opt__box--round">{on && <span className="opt__dot" />}</span>
                  <span className="opt__text">
                    <span className="opt__name">{o.label}</span>
                    <span className="opt__desc">{o.desc}</span>
                  </span>
                </button>
              );
            })}
            {payment.method === "dinheiro" && (
              <Field label={t.co_change_for} hint={`${t.co_total} ${fmt(total)} · ${t.co_change_hint}`}>
                <input className="input" type="text" inputMode="decimal" placeholder={currency === "BRL" ? "R$ 150,00" : "$ 40.000"} value={payment.changeFor} onChange={(e) => setPayment({ ...payment, changeFor: e.target.value })} />
              </Field>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="stepview">
            {errors.items && <p className="field__error">{errors.items}</p>}

            <ReviewCard title={t.co_review_order} onEdit={onClose} editLabel={t.co_edit_items}>
              <ul className="review__items">
                {items.map((it) => (
                  <li key={it.uid}>
                    <span className="review__qty">{it.qty}x</span>
                    <span className="review__name">
                      {itemTitle(it)}
                      {itemLines(it, t).map((l, i) => (
                        <small key={i}>{l}</small>
                      ))}
                    </span>
                    <span className="review__price">{fmt(lineTotal(it))}</span>
                  </li>
                ))}
              </ul>
            </ReviewCard>

            <ReviewCard
              title={orderType === "entrega" ? t.co_delivery : t.co_pickup}
              icon={orderType === "entrega" ? <BikeIcon size={18} /> : <StoreIcon size={18} />}
              onEdit={() => goTo(0)}
              editLabel={t.co_edit_type}
            >
              <p className="review__big">{customer.name.trim()}</p>
              {orderType === "entrega" ? (
                <p className="review__line review__line--muted">
                  <WhatsappIcon size={13} /> {t.co_location_short}
                </p>
              ) : (
                <>
                  <p className="review__line">{businessConfig.address}</p>
                  <p className="review__line review__line--muted">{businessConfig.pickupEta}</p>
                </>
              )}
            </ReviewCard>

            <ReviewCard title={t.co_step_payment} onEdit={() => goTo(1)} editLabel={t.co_change}>
              <p className="review__big">
                {payLabel}
                {payment.method === "dinheiro" && payment.changeFor.trim() && ` · ${t.co_change_for} ${payment.changeFor.trim()}`}
              </p>
              <p className="review__line review__line--muted">
                {currency === "BRL" ? <FlagBR size={13} /> : <FlagAR size={13} />} {currency === "BRL" ? "Reais" : "Pesos"}
              </p>
            </ReviewCard>

            <div className="totalbox">
              {fee && (
                <>
                  <div className="totalbox__row">
                    <span>{t.co_items}</span>
                    <span>{fmt(subtotal(items))}</span>
                  </div>
                  <div className="totalbox__row">
                    <span>{t.co_delivery_fee}</span>
                    <span>{fmt(deliveryFeeFor(orderType))}</span>
                  </div>
                </>
              )}
              <div className="totalbox__row totalbox__row--total">
                <span>{t.co_total}</span>
                <Price value={total} showOther className="totalbox__vals" />
              </div>
            </div>

            <details className="comanda-wrap">
              <summary>{t.co_preview}</summary>
              <ComandaPreview text={message} />
            </details>
          </section>
        )}
      </div>

      <footer className="checkout__foot">
        {step < 2 ? (
          <button type="button" className="btn btn--ink btn--block btn--lg" onClick={next}>
            {t.co_continue}
          </button>
        ) : (
          <button type="button" className="btn btn--wa btn--block btn--lg" onClick={send} disabled={items.length === 0}>
            <WhatsappIcon size={22} /> {t.co_send}
          </button>
        )}
        <span className="checkout__footmeta">
          {tf("cart_items", { n: itemCount(items) })} · {fmt(total)}
        </span>
      </footer>
    </div>
  );
};

// ── peças ──────────────────────────────────────────────────────────

const Field = ({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) => (
  <label className={`field ${error ? "has-error" : ""}`} {...(error ? { "data-error": true } : {})}>
    <span className="field__label">
      {label}
      {hint && <span className="field__hint">{hint}</span>}
    </span>
    {children}
    {error && <span className="field__error">{error}</span>}
  </label>
);

const ReviewCard = ({ title, icon, onEdit, editLabel, children }: { title: string; icon?: ReactNode; onEdit: () => void; editLabel: string; children: ReactNode }) => (
  <section className="review">
    <header className="review__head">
      <h3 className="review__title">
        {icon} {title}
      </h3>
      <button type="button" className="linkbtn" onClick={onEdit}>
        <EditIcon size={14} /> {editLabel}
      </button>
    </header>
    {children}
  </section>
);

/** Mensagem renderizada como comanda de cozinha, com *negrito* do WhatsApp. */
const ComandaPreview = ({ text }: { text: string }) => (
  <div className="comanda">
    {text.split("\n").map((line, i) => (
      <div key={i} className="comanda__line">
        {line === "" ? " " : renderBold(line)}
      </div>
    ))}
  </div>
);

const renderBold = (line: string): ReactNode =>
  line.split(/(\*[^*]+\*)/g).map((p, i) => (p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <strong key={i}>{p.slice(1, -1)}</strong> : <span key={i}>{p}</span>));
