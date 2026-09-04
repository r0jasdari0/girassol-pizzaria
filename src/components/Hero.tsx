import { motion, useReducedMotion } from "framer-motion";
import { siteImages } from "../data/images";
import { usePrefs } from "../store/prefs";
import { WhatsappIcon } from "./Icons";

type Props = { onBuild: () => void };

/** Ingredientes soltos que flutuam em volta da pizza do hero. */
const Floating = ({ children, x, y, delay, size }: { children: React.ReactNode; x: string; y: string; delay: number; size: number }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="hero__float"
      style={{ left: x, top: y, width: size, height: size }}
      animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden
    >
      {children}
    </motion.div>
  );
};

const Tomato = () => (
  <svg viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="#D9452F" />
    <circle cx="20" cy="20" r="13" fill="#F26B4E" />
    <g fill="#FFD9C9" opacity="0.85">
      <ellipse cx="20" cy="12" rx="2.5" ry="4" />
      <ellipse cx="27" cy="16" rx="2.5" ry="4" transform="rotate(60 27 16)" />
      <ellipse cx="27" cy="24" rx="2.5" ry="4" transform="rotate(120 27 24)" />
      <ellipse cx="20" cy="28" rx="2.5" ry="4" />
      <ellipse cx="13" cy="24" rx="2.5" ry="4" transform="rotate(60 13 24)" />
      <ellipse cx="13" cy="16" rx="2.5" ry="4" transform="rotate(120 13 16)" />
    </g>
  </svg>
);
const Basil = () => (
  <svg viewBox="0 0 40 40">
    <path d="M6 30C8 14 20 6 34 8 32 22 22 32 6 30Z" fill="#3E8A3E" />
    <path d="M8 29 30 10" stroke="#2C6A2C" strokeWidth="1.5" fill="none" />
  </svg>
);
const Pepperoni = () => (
  <svg viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="17" fill="#A33A24" />
    <circle cx="20" cy="20" r="14" fill="#B5432B" />
    <g fill="#7E2A18" opacity="0.7">
      <circle cx="14" cy="15" r="1.6" />
      <circle cx="24" cy="12" r="1.3" />
      <circle cx="27" cy="22" r="1.6" />
      <circle cx="17" cy="26" r="1.4" />
      <circle cx="21" cy="19" r="1.2" />
    </g>
  </svg>
);
const Cheese = () => (
  <svg viewBox="0 0 40 40">
    <path d="M6 28 20 10l14 8v12H6Z" fill="#F5D66B" />
    <path d="M6 28 20 10l14 8-14 4Z" fill="#FBE597" />
    <circle cx="14" cy="24" r="1.8" fill="#E8B93A" />
    <circle cx="25" cy="26" r="1.4" fill="#E8B93A" />
  </svg>
);

export const Hero = ({ onBuild }: Props) => {
  const { t } = usePrefs();
  const reduce = useReducedMotion();

  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <div className="hero__copy">
          <motion.img
            className="hero__brand"
            src={siteImages.logo}
            alt="Girassol Pizzaria"
            width={1200}
            height={893}
            fetchPriority="high"
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -5, 0], scale: 1 }}
            transition={
              reduce
                ? { duration: 0.3 }
                : { opacity: { duration: 0.5 }, scale: { duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }
            }
          />
          <span className="eyebrow eyebrow--red hero__eyebrow">Pizzaria &amp; Açaí · Bernardo de Irigoyen</span>
          <p className="hero__text">{t.hero_text}</p>
          <div className="hero__ctas">
            <button type="button" className="btn btn--ink btn--xl" onClick={onBuild}>
              {t.hero_cta}
            </button>
            <a href="#cardapio" className="btn btn--outline btn--xl">
              {t.hero_cta_2}
            </a>
          </div>
          <p className="hero__note">
            <WhatsappIcon size={16} /> {t.hero_note}
          </p>
        </div>

        <motion.div
          className="hero__stage"
          initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="hero__disc" aria-hidden />
          <img
            className="hero__photo"
            src={siteImages.heroPizza}
            alt="Pizza Girassol meio Calabresa, meio 4 Queijos, no forno a lenha"
            width={1200}
            height={1200}
            fetchPriority="high"
          />
          <Floating x="-4%" y="12%" delay={0} size={56}>
            <Tomato />
          </Floating>
          <Floating x="84%" y="6%" delay={0.8} size={48}>
            <Basil />
          </Floating>
          <Floating x="88%" y="70%" delay={0.4} size={50}>
            <Pepperoni />
          </Floating>
          <Floating x="2%" y="76%" delay={1.2} size={44}>
            <Cheese />
          </Floating>
        </motion.div>
      </div>
    </section>
  );
};
