import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { businessConfig } from "../config/business";
import { es } from "../i18n/es";
import { pt, type Dict } from "../i18n/pt";
import type { Currency, Lang, Price } from "../types";

const KEY = "girassol.prefs.v2";

type Prefs = { currency: Currency; lang: Lang };

type PrefsApi = Prefs & {
  setCurrency: (c: Currency) => void;
  setLang: (l: Lang) => void;
  /** Dicionário do idioma ativo. */
  t: Dict;
  /** Interpola {a}, {b}, {n} em uma string do dicionário. */
  tf: (key: keyof Dict, vars: Record<string, string | number>) => string;
  /** Formata um preço na moeda ativa. */
  fmt: (p: Price) => string;
  /** Formata na outra moeda (para mostrar discretamente quando fizer sentido). */
  fmtOther: (p: Price) => string;
};

const load = (): Prefs => {
  const base: Prefs = { currency: businessConfig.defaultCurrency, lang: businessConfig.defaultLang };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...base, ...(JSON.parse(raw) as Partial<Prefs>) };
    // primeira visita: idioma do aparelho
    if (typeof navigator !== "undefined" && /^es/i.test(navigator.language)) {
      return { currency: "ARS", lang: "es" };
    }
  } catch {
    /* ignora */
  }
  return base;
};

export const formatPrice = (p: Price, currency: Currency): string =>
  currency === "BRL"
    ? p.brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : p.ars.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const PrefsContext = createContext<PrefsApi | null>(null);

export const PrefsProvider = ({ children }: { children: ReactNode }) => {
  const [prefs, setPrefs] = useState<Prefs>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignora */
    }
    document.documentElement.lang = prefs.lang === "pt" ? "pt-BR" : "es-AR";
  }, [prefs]);

  const setCurrency = useCallback((currency: Currency) => setPrefs((p) => ({ ...p, currency })), []);
  const setLang = useCallback((lang: Lang) => setPrefs((p) => ({ ...p, lang })), []);

  const api = useMemo<PrefsApi>(() => {
    const t = prefs.lang === "pt" ? pt : es;
    const other: Currency = prefs.currency === "BRL" ? "ARS" : "BRL";
    return {
      ...prefs,
      setCurrency,
      setLang,
      t,
      tf: (key, vars) => Object.entries(vars).reduce((s, [k, v]) => s.split(`{${k}}`).join(String(v)), t[key]),
      fmt: (p) => formatPrice(p, prefs.currency),
      fmtOther: (p) => formatPrice(p, other),
    };
  }, [prefs, setCurrency, setLang]);

  return <PrefsContext.Provider value={api}>{children}</PrefsContext.Provider>;
};

export const usePrefs = (): PrefsApi => {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs precisa estar dentro de <PrefsProvider>");
  return ctx;
};
