type P = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export const WhatsappIcon = ({ size = 22, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const CheckIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} strokeWidth={2.5}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
export const CloseIcon = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const BackIcon = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
export const ChevronIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const PlusIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} strokeWidth={2.5}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MinusIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} strokeWidth={2.5}>
    <path d="M5 12h14" />
  </svg>
);
export const TrashIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);
export const CopyIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
export const EditIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
export const BagIcon = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 8h12l1 13H5L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const BikeIcon = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6h-3l-3 6h6l3.5 5.5M12 12l-3 5.5M15 6l1.5 4" />
  </svg>
);
export const StoreIcon = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 9 4.5 4h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6" />
  </svg>
);
export const SearchIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const FlameIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3 0-3-1-6-3-8-1 4-5 6-5 12a7 7 0 0 0 7 7Z" />
  </svg>
);

/** Marca da Girassol: miolo escuro com pétalas em traço. */
export const SunflowerMark = ({ size = 36, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
    <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.15" />
    <circle cx="32" cy="32" r="11" fill="currentColor" />
    <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
      <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6" />
    </g>
  </svg>
);
