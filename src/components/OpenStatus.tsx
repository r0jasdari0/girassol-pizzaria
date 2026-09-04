import { businessConfig } from "../config/business";
import { formatHour, useOpenStatus, weekdayName, type OpenStatus } from "../lib/hours";
import { usePrefs } from "../store/prefs";
import type { Dict } from "../i18n/pt";
import type { Lang } from "../types";

type Tf = (key: keyof Dict, vars: Record<string, string | number>) => string;

/** "hoje às 14h" / "amanhã às 14h" / "terça às 14h" */
export const whenOpens = (s: Extract<OpenStatus, { open: false }>, tf: Tf, lang: Lang): string => {
  const t = formatHour(s.opensAt, lang);
  if (s.opensIn === "today") return tf("when_today", { t });
  if (s.opensIn === "tomorrow") return tf("when_tomorrow", { t });
  return tf("when_day", { d: weekdayName(s.opensWeekday, lang), t });
};

/** Pastilha "Aberto agora · até 23h45" / "Fechado · abre hoje às 14h". */
export const StatusPill = () => {
  const { tf, lang } = usePrefs();
  const s = useOpenStatus();
  if (s.open) {
    return (
      <span className="status status--open">
        <span className="status__dot" /> {tf("status_open", { t: formatHour(s.closesAt, lang) })}
      </span>
    );
  }
  const t = formatHour(s.opensAt, lang);
  const text =
    s.opensIn === "today"
      ? tf("status_closed_today", { t })
      : s.opensIn === "tomorrow"
        ? tf("status_closed_tomorrow", { t })
        : tf("status_closed_day", { d: weekdayName(s.opensWeekday, lang), t });
  return (
    <span className="status status--closed">
      <span className="status__dot" /> {text}
    </span>
  );
};

/** Faixa abaixo da barra, só quando fechado. */
export const ClosedBanner = () => {
  const { tf, lang } = usePrefs();
  const s = useOpenStatus();
  if (s.open) return null;
  const { open, close } = businessConfig.schedule;
  return (
    <div className="closedbar" role="status">
      <strong>{tf("closed_banner", { when: whenOpens(s, tf, lang) })}</strong>
      <span className="closedbar__hours">{tf("hours_line", { a: formatHour(open, lang), b: formatHour(close, lang) })}</span>
    </div>
  );
};
