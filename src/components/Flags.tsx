type P = { size?: number };

/** Bandeiras em SVG: emoji de bandeira não renderiza no Windows. */
export const FlagBR = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
    <rect width="20" height="20" rx="10" fill="#009C3B" />
    <path d="M10 3.5 17 10l-7 6.5L3 10Z" fill="#FFDF00" />
    <circle cx="10" cy="10" r="3.4" fill="#002776" />
  </svg>
);

export const FlagAR = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
    <circle cx="10" cy="10" r="10" fill="#74ACDF" />
    <rect x="0" y="6.6" width="20" height="6.8" fill="#fff" />
    <circle cx="10" cy="10" r="2" fill="#F6B40E" />
  </svg>
);
