import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { acaiBases, acaiSizes, acaiToppings, byId } from "../data/products";
import { usePrefs } from "../store/prefs";

type Props = { baseId: string; sizeId: string; toppingIds: string[] };

/** Copo de açaí que se enche conforme os acompanhamentos entram. */
export const AcaiPreview = ({ baseId, sizeId, toppingIds }: Props) => {
  const { t } = usePrefs();
  const reduce = useReducedMotion();
  const base = byId(acaiBases, baseId);
  const size = byId(acaiSizes, sizeId);
  const height = 150 + (size.ml - 300) * 0.25; // 150 → 200
  const tops = toppingIds.map((id) => byId(acaiToppings, id));

  // Geometria do copo (viewBox 160x200): boca larga, base estreita.
  const topY = 34;
  const botY = 190;
  const cupPath = `M22,${topY} L138,${topY} L124,${botY} Q120,${botY + 6} 112,${botY + 6} L48,${botY + 6} Q40,${botY + 6} 36,${botY} Z`;
  const fillPath = `M27,${topY + 6} L133,${topY + 6} L121,${botY - 4} Q118,${botY} 112,${botY} L48,${botY} Q42,${botY} 39,${botY - 4} Z`;

  return (
    <div className="acaicup">
      <motion.svg
        className="acaicup__svg"
        viewBox="0 0 160 200"
        role="img"
        aria-label={`${base.name} ${size.ml}ml`}
        animate={{ height, width: height * 0.8 }}
        initial={false}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <defs>
          <clipPath id="cupClip">
            <path d={fillPath} />
          </clipPath>
        </defs>

        {/* sombra e copo */}
        <ellipse cx="80" cy={botY + 8} rx="46" ry="6" fill="rgba(22,16,6,0.18)" />
        <path d={cupPath} fill="rgba(255,255,255,0.55)" stroke="rgba(75,29,94,0.25)" strokeWidth="2" />

        {/* base (açaí ou cupuaçu) */}
        <motion.path d={fillPath} animate={{ fill: base.color }} transition={{ duration: 0.3 }} />
        <path d={fillPath} fill="url(#none)" opacity="0" />
        <ellipse cx="80" cy={topY + 8} rx="53" ry="6" fill={base.color} opacity="0.85" />

        {/* acompanhamentos, do fundo para cima */}
        <g clipPath="url(#cupClip)">
          <AnimatePresence>
            {tops.map((tp, i) => {
              const y = topY + 18 + (i % 4) * 24 + Math.floor(i / 4) * 10;
              const seed = i * 37;
              const x = 40 + (seed % 70);
              const common = {
                initial: reduce ? false : { y: -40, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: reduce ? undefined : { opacity: 0, scale: 0.6 },
                transition: { type: "spring" as const, stiffness: 320, damping: 20, delay: 0.03 * i },
              };
              switch (tp.shape) {
                case "drizzle":
                  return (
                    <motion.path
                      key={tp.id}
                      {...common}
                      d={`M${30 + (seed % 20)},${y} q12,-8 24,0 t24,0 t24,0 t20,0`}
                      stroke={tp.color}
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  );
                case "sprinkle":
                  return (
                    <motion.g key={tp.id} {...common}>
                      {Array.from({ length: 9 }, (_, k) => (
                        <circle key={k} cx={28 + ((seed + k * 29) % 104)} cy={y - 6 + ((k * 13) % 18)} r="2.2" fill={tp.color} />
                      ))}
                    </motion.g>
                  );
                case "slice":
                  return (
                    <motion.g key={tp.id} {...common}>
                      {Array.from({ length: 3 }, (_, k) => (
                        <path
                          key={k}
                          d={`M${x - 30 + k * 30},${y + 6} a12,12 0 0 1 24,0 Z`}
                          fill={tp.color}
                          stroke="rgba(0,0,0,0.12)"
                        />
                      ))}
                    </motion.g>
                  );
                case "cream":
                  return (
                    <motion.path
                      key={tp.id}
                      {...common}
                      d={`M40,${topY + 14} q20,-22 40,-6 q20,-16 40,6 q-10,10 -40,10 q-30,0 -40,-10Z`}
                      fill={tp.color}
                      stroke="rgba(0,0,0,0.08)"
                    />
                  );
                default: // chunk
                  return (
                    <motion.g key={tp.id} {...common}>
                      {Array.from({ length: 4 }, (_, k) => (
                        <rect
                          key={k}
                          x={30 + ((seed + k * 31) % 90)}
                          y={y - 8 + ((k * 7) % 12)}
                          width="14"
                          height="12"
                          rx="3"
                          fill={tp.color}
                          stroke="rgba(0,0,0,0.12)"
                          transform={`rotate(${(k * 23) % 40 - 20} ${37 + ((seed + k * 31) % 90)} ${y - 2})`}
                        />
                      ))}
                    </motion.g>
                  );
              }
            })}
          </AnimatePresence>
        </g>

        {tops.length === 0 && (
          <text x="80" y="118" textAnchor="middle" className="acaicup__hint" fill={base.id === "acai" ? "#F0E6F5" : "#4B1D5E"}>
            {t.ab_empty_cup}
          </text>
        )}

        {/* brilho do copo */}
        <path d={`M30,${topY + 10} L38,${botY - 10}`} stroke="rgba(255,255,255,0.45)" strokeWidth="4" strokeLinecap="round" />
      </motion.svg>

      <div className="acaicup__caption">
        <strong>
          {base.name} · {size.ml} ml
        </strong>
        {tops.length > 0 && <span>{tops.map((x) => x.name).join(" · ")}</span>}
      </div>
    </div>
  );
};
