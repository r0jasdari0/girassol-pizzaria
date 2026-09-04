import { motion, useReducedMotion } from "framer-motion";
import { byId, pizzaCrusts, pizzaFlavors, pizzaSizes } from "../data/products";
import { fraction } from "../lib/format";
import { CloseIcon } from "./Icons";
import { usePrefs } from "../store/prefs";

type Props = {
  sizeId: string;
  flavorIds: string[];
  crustId: string;
  /** Tamanho em pixels do desenho (padrão: proporcional ao cm). */
  px?: number;
  /** Sem legenda, para o hero. */
  hero?: boolean;
  /** Rótulos "Sabor 1/2/3" nas fatias vazias. */
  slots?: boolean;
  /** Título mostrado acima da legenda (ex.: "Escolha até 3 sabores"). */
  title?: string;
  /** Quando presente, cada sabor da legenda ganha um × para remover. */
  onRemove?: (id: string) => void;
};

const C = 110;
const R_CRUST = 100;
const R_TOP = 86;

const polar = (deg: number, r: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
};

const wedgePath = (a0: number, a1: number, r: number): string => {
  const [x0, y0] = polar(a0, r);
  const [x1, y1] = polar(a1, r);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${C},${C} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
};

const bits = (a0: number, span: number, count: number, seed: number): [number, number, number][] =>
  Array.from({ length: count }, (_, j) => {
    const t = ((j + 1) * 0.618 + seed * 0.173) % 1;
    const u = ((j + 1) * 0.382 + seed * 0.291) % 1;
    const [x, y] = polar(a0 + span * (0.14 + 0.72 * t), 24 + 50 * u);
    return [x, y, 3 + ((j + seed) % 3) * 1.4];
  });

const splitName = (name: string): string[] => {
  if (name.length <= 11) return [name];
  const words = name.split(" ");
  if (words.length === 1) return [name];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
};

/**
 * Pizza que se monta conforme o cliente escolhe: o tamanho muda o diâmetro,
 * cada sabor vira uma fatia, a borda muda a cor do contorno.
 */
export const PizzaPreview = ({ sizeId, flavorIds, crustId, px, hero = false, slots = false, title, onRemove }: Props) => {
  const { t } = usePrefs();
  const reduce = useReducedMotion();
  const size = byId(pizzaSizes, sizeId);
  const crust = byId(pizzaCrusts, crustId);
  const n = flavorIds.length;
  // A pizza mostra só as fatias já escolhidas: 2 sabores = metades, 3 = terços.
  // Com `slots`, um único sabor numa pizza que aceita mais mostra a metade vazia "Sabor 2".
  const slotCount = slots && n === 1 && size.maxFlavors > 1 ? 2 : n;
  const span = slotCount > 0 ? 360 / slotCount : 360;
  const width = px ?? 150 + (size.cm - 25) * 4; // 150 → 230
  const crustFill = crust.color;

  return (
    <div className={`pizza ${hero ? "pizza--hero" : ""}`}>
      <motion.svg
        className="pizza__svg"
        viewBox="0 0 220 220"
        role="img"
        aria-label={`Pizza ${size.name} ${size.cm}cm`}
        animate={{ width, height: width, rotate: reduce ? 0 : (size.cm - 35) * 0.6 }}
        initial={false}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <defs>
          <radialGradient id="crustGrad" cx="50%" cy="45%" r="55%">
            <stop offset="72%" stopColor={crustFill} />
            <stop offset="100%" stopColor="#B8783A" />
          </radialGradient>
        </defs>

        <circle cx={C} cy={C + 4} r={R_CRUST} fill="rgba(22,16,6,0.22)" />
        <circle cx={C} cy={C} r={R_CRUST} fill="url(#crustGrad)" />
        {crust.price.brl > 0 && (
          <motion.circle
            cx={C}
            cy={C}
            r={R_CRUST - 7}
            fill="none"
            stroke={crustFill}
            strokeWidth="5"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.95 }}
            transition={{ duration: 0.5 }}
          />
        )}
        <circle cx={C} cy={C} r={R_TOP + 2} fill="#C8412B" />

        {n === 0 ? (
          <>
            <circle cx={C} cy={C} r={R_TOP} fill="#F3E3B0" />
            {!hero && (
              <text x={C} y={C + 4} textAnchor="middle" className="pizza__hint">
                {t.pb_pick_flavor}
              </text>
            )}
          </>
        ) : (
          Array.from({ length: slotCount }, (_, i) => {
            const a0 = -90 + i * span;
            const a1 = a0 + span;
            const mid = a0 + span / 2;
            const id = flavorIds[i];
            const [lx, ly] = polar(mid, slotCount === 1 ? 0 : 52);
            if (!id) {
              return (
                <g key={`slot-${i}`}>
                  <path d={wedgePath(a0, a1, R_TOP)} fill="#F3E3B0" opacity="0.9" />
                  <text x={lx} y={ly + 3} textAnchor="middle" className="pizza__hint">
                    {t.pb_flavor_n} {i + 1}
                  </text>
                </g>
              );
            }
            const f = byId(pizzaFlavors, id);
            const lines = slotCount === 1 ? [f.name] : splitName(f.name);
            return (
              <motion.g
                key={id}
                style={{ originX: "110px", originY: "110px" }}
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {slotCount === 1 ? <circle cx={C} cy={C} r={R_TOP} fill={f.color} /> : <path d={wedgePath(a0, a1, R_TOP)} fill={f.color} />}
                {bits(a0, span, slotCount === 1 ? 14 : Math.max(4, Math.round(10 / slotCount) + 3), i).map(([x, y, r], k) => (
                  <circle key={k} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} fill={f.bits} opacity="0.92" />
                ))}
                <text x={lx} y={ly - (lines.length - 1) * 5} textAnchor="middle" className="pizza__label">
                  {lines.map((ln, k) => (
                    <tspan key={k} x={lx} dy={k === 0 ? 0 : 11}>
                      {ln}
                    </tspan>
                  ))}
                </text>
              </motion.g>
            );
          })
        )}

        {slotCount > 1 &&
          Array.from({ length: slotCount }, (_, i) => {
            const [x, y] = polar(-90 + i * span, R_TOP + 1);
            return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="#C8412B" strokeWidth="2.5" strokeLinecap="round" />;
          })}
      </motion.svg>

      {!hero && (
        <div className="pizza__caption">
          {title ? (
            <>
              <strong className="pizza__title">{title}</strong>
              <span className="pizza__size">
                {size.name} · {size.cm} cm
              </span>
            </>
          ) : (
            <strong>
              {size.name} · {size.cm} cm
            </strong>
          )}
          {n > 0 && (
            <ul className={`pizza__legend ${onRemove ? "pizza__legend--edit" : ""}`}>
              {flavorIds.map((id) => {
                const f = byId(pizzaFlavors, id);
                return (
                  <li key={id}>
                    <span className="pizza__swatch" style={{ background: f.bits }} />
                    {fraction(slotCount)}
                    {f.name}
                    {onRemove && (
                      <button type="button" className="pizza__remove" aria-label={`${t.cart_remove} ${f.name}`} onClick={() => onRemove(id)}>
                        <CloseIcon size={14} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {crust.price.brl > 0 && (
            <span className="pizza__crust">
              {t.pb_step_crust} {crust.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
