import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { businessConfig } from "../config/business";
import { itemLines, itemTitle } from "../lib/describe";
import { isValidPhone, maskPhone, onlyDigits } from "../lib/format";
import { deliveryFeeFor, hasDeliveryFee, itemCount, lineTotal, orderTotal, subtotal } from "../lib/pricing";
import { buildOrderMessage, buildWhatsappUrl, openWhatsapp } from "../lib/whatsapp";
import { useCart } from "../store/cart";
import { usePrefs } from "../store/prefs";
import type { Address, Customer, Order, OrderType, Payment, PaymentMethod } from "../types";
import { FlagAR, FlagBR } from "./Flags";
import { BackIcon, BikeIcon, CheckIcon, CopyIcon, EditIcon, StoreIcon, WhatsappIcon } from "./Icons";
import { Price } from "./Price";

type Step = 0 | 1 | 2 | 3;
const emptyAddress: Address = { street: "", number: "", neighborhood: "", reference: "" };
const KEY_CUSTOMER = "girassol.customer.v2";
const KEY_ADDRESS = "girassol.address.v2";
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
  const [customer, setCustomer] = useState<Customer>(() => loadJson(KEY_CUSTOMER, { name: "", phone: "" }));
  const [address, setAddress] = useState<Address>(() => loadJson(KEY_ADDRESS, emptyAddress));
  const [orderType, setOrderType] = useState<OrderType>(() => loadJson(KEY_TYPE, { v: "entrega" as OrderType }).v);
  const [payment, setPayment] = useState<Payment>({ method: null, changeFor: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ url: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => saveJson(KEY_CUSTOMER, customer), [customer]);
  useEffect(() => saveJson(KEY_ADDRESS, address), [address]);
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

  const STEPS = [t.co_step_data, t.co_step_delivery, t.co_step_payment, t.co_step_review];

  const order: Order = useMemo(
    () => ({ customer, orderType, address, payment, currency, items }),
    [customer, orderType, address, payment, currency, items],
  );
  const message = useMemo(() => buildOrderMessage(order), [order]);
  const total = orderTotal(items, orderType);
  const fee = hasDeliveryFee(orderType);

  const validate = (s: Step): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (customer.name.trim().length < 2) e.name = t.co_err_name;
      if (!isValidPhone(customer.phone)) e.phone = t.co_err_phone;
    }
    if (s === 1 && orderType === "entrega") {
      if (!address.street.trim()) e.street = t.co_err_street;
      if (!address.number.trim()) e.number = t.co_err_number;
      if (!address.neighborhood.trim()) e.neighborhood = t.co_err_neighborhood;
    }
    if (s === 2 && !payment.method) e.payment = t.co_err_payment;
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      bodyRef.current?.querySelector<HTMLElement>("[data-error]")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setStep((s) => Math.min(3, s + 1) as Step);
  };
  const back = () => (step === 0 ? onClose() : setStep((s) => Math.max(0, s - 1) as Step));
  const goTo = (s: Step) => {
    setErrors({});
    setStep(s);
  };

  const send = () => {
    const all = { ...validate(0), ...validate(1), ...validate(2) };
    if (items.length === 0) all.items = t.co_err_empty;
    if (Object.keys(all).length) {
      setErrors(all);
      if (all.name || all.phone) goTo(0);
      else if (all.street || all.number || all.neighborhood) goTo(1);
      else if (all.payment) goTo(2);
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

  const payOptions: { id: PaymentMethod; label: string; desc: string }[] = [
    { id: "dinheiro", label: t.pay_dinheiro, desc: t.pay_dinheiro_desc },
    { id: "pix", label: t.pay_pix, desc: t.pay_pix_desc },
    { id: "mercadopago", label: t.pay_mercadopago, desc: t.pay_mercadopago_desc },
    { id: "cartao", label: t.pay_cartao, desc: t.pay_cartao_desc },
  ];
  const payLabel = payOptions.find((p) => p.id === payment.method)?.label ?? "";

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

      <ol className="steps">
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
              <input className="input" type="text" autoComplete="name" placeholder={t.co_name_ph} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} autoFocus />
            </Field>
            <Field label={t.co_phone} error={errors.phone} hint={t.co_phone_hint}>
              <input
                className="input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={t.co_phone_ph}
                value={maskPhone(customer.phone)}
                onChange={(e) => setCustomer({ ...customer, phone: onlyDigits(e.target.value).slice(0, 12) })}
              />
            </Field>
          </section>
        )}

        {step === 1 && (
          <section className="stepview">
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

            {orderType === "retirada" ? (
              <div className="card card--red">
                <span className="eyebrow">{t.co_pickup_at}</span>
                <p className="card__big">{businessConfig.address}</p>
                <p className="card__text">
                  {businessConfig.city} · {businessConfig.hours}
                </p>
              </div>
            ) : (
              <div className="grid-2">
                <Field label={t.co_address} error={errors.street} span={2}>
                  <input className="input" type="text" autoComplete="street-address" placeholder={t.co_address_ph} value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </Field>
                <Field label={t.co_number} error={errors.number}>
                  <input className="input" type="text" inputMode="numeric" placeholder="145" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
                </Field>
                <Field label={t.co_neighborhood} error={errors.neighborhood}>
                  <input className="input" type="text" autoComplete="address-level3" placeholder={t.co_neighborhood_ph} value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} />
                </Field>
                <Field label={t.co_reference} hint={t.optional} span={2}>
                  <input className="input" type="text" placeholder={t.co_reference_ph} value={address.reference} onChange={(e) => setAddress({ ...address, reference: e.target.value })} />
                </Field>
              </div>
            )}
          </section>
        )}

        {step === 2 && (
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

        {step === 3 && (
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

            {orderType === "entrega" ? (
              <ReviewCard title={t.co_delivery} icon={<BikeIcon size={18} />} onEdit={() => goTo(1)} editLabel={t.co_edit_address}>
                <p className="review__big">
                  {address.street}, {address.number}
                </p>
                <p className="review__line">{address.neighborhood}</p>
                {address.reference && (
                  <p className="review__line review__line--muted">
                    {t.co_reference}: {address.reference}
                  </p>
                )}
              </ReviewCard>
            ) : (
              <ReviewCard title={t.co_pickup} icon={<StoreIcon size={18} />} onEdit={() => goTo(1)} editLabel={t.co_switch_to_delivery}>
                <p className="review__big">{businessConfig.address}</p>
                <p className="review__line review__line--muted">{businessConfig.pickupEta}</p>
              </ReviewCard>
            )}

            <ReviewCard title={t.co_step_payment} onEdit={() => goTo(2)} editLabel={t.co_change}>
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
        {step < 3 ? (
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

const Field = ({ label, hint, error, span, children }: { label: string; hint?: string; error?: string; span?: 2; children: ReactNode }) => (
  <label className={`field ${span === 2 ? "field--span" : ""} ${error ? "has-error" : ""}`} {...(error ? { "data-error": true } : {})}>
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
