import { motion, useReducedMotion } from "framer-motion";
import { siteImages } from "../data/images";
import { usePrefs } from "../store/prefs";
import { WhatsappIcon } from "./Icons";
import { StatusPill } from "./OpenStatus";
import { Carousel } from "./Carousel";

type Props = { onBuild: () => void };


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
          <Carousel />
          <div className="hero__status">
            <StatusPill />
          </div>
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

      </div>
    </section>
  );
};
