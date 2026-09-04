import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { bannerSrc, banners } from "../data/banners";
import { usePrefs } from "../store/prefs";
import { ChevronIcon } from "./Icons";

const INTERVAL = 4500;

/**
 * Carrossel de banners: arrasto com o dedo (scroll-snap nativo), avanço automático,
 * pausa ao tocar/passar o mouse, pontos de navegação e setas no desktop.
 * Cada slide é um link para a seção correspondente do cardápio.
 */
export const Carousel = () => {
  const { t } = usePrefs();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== "undefined" && document.hidden);
  const slides = banners.filter((b) => b.available);
  const n = slides.length;

  const goTo = useCallback(
    (i: number, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;
      const target = ((i % n) + n) % n;
      const child = track.children[target] as HTMLElement | undefined;
      if (!child) return;
      track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: smooth && !reduce ? "smooth" : "auto" });
    },
    [n, reduce],
  );

  // índice atual a partir da posição do scroll (funciona com arrasto manual)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = track.clientWidth || 1;
        setIndex(Math.round(track.scrollLeft / w) % n);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  // avanço automático
  useEffect(() => {
    if (paused || hidden || reduce || n < 2) return;
    const id = setInterval(() => goTo(index + 1), INTERVAL);
    return () => clearInterval(id);
  }, [index, paused, hidden, reduce, n, goTo]);

  // pausa quando a aba fica em segundo plano
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (n === 0) return null;

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label={t.carousel_label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="carousel__track" ref={trackRef}>
        {slides.map((b, i) => (
          <a
            key={b.id}
            className="carousel__slide"
            href={b.href}
            aria-label={b.alt}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <img src={bannerSrc(b)} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" width={1600} height={1200} />
            <span className="carousel__cta">
              {t.carousel_cta} <ChevronIcon size={16} />
            </span>
          </a>
        ))}
      </div>

      {n > 1 && (
        <>
          <button type="button" className="carousel__arrow carousel__arrow--prev" aria-label={t.carousel_prev} onClick={() => goTo(index - 1)}>
            <ChevronIcon size={20} />
          </button>
          <button type="button" className="carousel__arrow carousel__arrow--next" aria-label={t.carousel_next} onClick={() => goTo(index + 1)}>
            <ChevronIcon size={20} />
          </button>
          <div className="carousel__dots" role="tablist">
            {slides.map((b, i) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1}/${n}`}
                className={`carousel__dot ${i === index ? "is-on" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
