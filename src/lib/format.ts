/** Mantém apenas dígitos. */
export const onlyDigits = (s: string): string => s.replace(/\D/g, "");

/**
 * Máscara visual enquanto digita. Aceita números brasileiros (10–11 dígitos)
 * e argentinos (10 dígitos com código de área, com ou sem o 9 / 15).
 * Ex.: (49) 99999-9999 · (3741) 41-5697
 */
export const maskPhone = (raw: string): string => {
  const d = onlyDigits(raw).slice(0, 12);
  if (d.length === 0) return "";
  if (d.length <= 4) return `(${d}`;
  if (d.length <= 8) return `(${d.slice(0, 4)}) ${d.slice(4)}`;
  if (d.length <= 10) return `(${d.slice(0, 4)}) ${d.slice(4, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const isValidPhone = (raw: string): boolean => {
  const d = onlyDigits(raw);
  return d.length >= 10 && d.length <= 12;
};

/** Formato legível na mensagem: mantém os dígitos agrupados. */
export const formatPhoneMsg = (raw: string): string => {
  const d = onlyDigits(raw);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 4)}) ${d.slice(4, 6)}-${d.slice(6)}`;
  return d;
};

/** Fração por sabor: "", "½ ", "⅓ ", "¼ " */
export const fraction = (count: number): string => {
  switch (count) {
    case 2:
      return "½ ";
    case 3:
      return "⅓ ";
    case 4:
      return "¼ ";
    default:
      return "";
  }
};

/** Fração em texto simples para o WhatsApp: "1/2 " */
export const fractionAscii = (count: number): string => (count <= 1 ? "" : `1/${count} `);

export const pad2 = (n: number): string => String(n).padStart(2, "0");
