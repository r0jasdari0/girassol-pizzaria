import { useEffect, useState } from "react";
import { businessConfig } from "../config/business";
import type { Lang } from "../types";

/**
 * Horário de funcionamento calculado no fuso da loja (não no do celular do cliente).
 * Regras em businessConfig.schedule.
 */
export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string; opensIn: "today" | "tomorrow" | "day"; opensWeekday: number };

const { timezone, open, close, closedDays } = businessConfig.schedule;

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Dia da semana (0=domingo) e minutos desde a meia-noite, no fuso da loja. */
const localNow = (now: Date): { weekday: number; minutes: number } => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const hour = Number(get("hour")) % 24;
  return { weekday, minutes: hour * 60 + Number(get("minute")) };
};

export const getOpenStatus = (now: Date = new Date()): OpenStatus => {
  const { weekday, minutes } = localNow(now);
  const openMin = toMinutes(open);
  const closeMin = toMinutes(close);
  const isClosedDay = (d: number) => (closedDays as readonly number[]).includes(d);

  if (!isClosedDay(weekday) && minutes >= openMin && minutes < closeMin) {
    return { open: true, closesAt: close };
  }
  // Abre ainda hoje?
  if (!isClosedDay(weekday) && minutes < openMin) {
    return { open: false, opensAt: open, opensIn: "today", opensWeekday: weekday };
  }
  // Próximo dia aberto
  for (let i = 1; i <= 7; i++) {
    const d = (weekday + i) % 7;
    if (!isClosedDay(d)) {
      return { open: false, opensAt: open, opensIn: i === 1 ? "tomorrow" : "day", opensWeekday: d };
    }
  }
  return { open: false, opensAt: open, opensIn: "day", opensWeekday: weekday };
};

/** Reavalia a cada minuto. */
export const useOpenStatus = (): OpenStatus => {
  const [status, setStatus] = useState<OpenStatus>(() => getOpenStatus());
  useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
};

const WEEKDAYS: Record<Lang, string[]> = {
  pt: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
};

/** "14h" / "23h45" em português, "14:00" / "23:45" em espanhol. */
export const formatHour = (hhmm: string, lang: Lang): string => {
  const [h, m] = hhmm.split(":");
  if (lang === "pt") return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
  return `${h}:${m}`;
};

export const weekdayName = (d: number, lang: Lang): string => WEEKDAYS[lang][d];
