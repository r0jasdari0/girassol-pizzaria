import { type ReactNode } from "react";

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
  const current = options.find((o) => o.id === value) ?? options[0];

  return (
    <>
      {/* celular: chips pequenos, preço só no escolhido */}
      <div className="sizechips" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <button key={o.id} type="button" role="radio" aria-checked={on} className={`sizemini ${on ? "is-on" : ""}`} onClick={() => onChange(o.id)}>
              <span className="sizemini__name">{o.name}</span>
              {on && <span className="sizemini__price">{o.price}</span>}
            </button>
          );
        })}
      </div>
      <p className="sizechips__meta">{current.meta}</p>

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
