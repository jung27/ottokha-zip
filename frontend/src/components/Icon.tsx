import type { JSX } from "react/jsx-runtime";
import type { IconName } from "../types";

const iconNodes: Record<IconName, JSX.Element> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M9 21v-8h6v8" />
    </>
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  back: <path d="M20 12H4m6-6-6 6 6 6" />,
  book: <path d="M4 3h14a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2Zm0 14h16M8 3v14" />,
  map: <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Zm6-3v15m6-12v15" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 3m0 3h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  key: (
    <>
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 9 9m-4-4 3-3m-6 0 3-3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  file: <path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h6" />,
  chat: (
    <>
      <path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-7a8 8 0 1 1 17-4Z" />
      <path d="M8 10h8m-8 4h5" />
    </>
  ),
  building: (
    <path d="M5 21V3h14v18M2 21h20M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3" />
  ),
  roof: <path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-8h6v8m1-16V2h3v5" />,
  stairs: <path d="M3 4v17h18M3 15h6v-5h6V5h6" />,
  people: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-4a6 6 0 0 1 12 0v4m1-17a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3" />
    </>
  ),
  window: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18M4 12h16" />
    </>
  ),
  water: (
    <>
      <path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />
      <path d="M9 15a3 3 0 0 0 3 3" />
    </>
  ),
  door: <path d="M4 22V2h16v20M8 22V5l9-2v19m-4-9h.01" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10h.01" />
    </>
  ),
  spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />,
  flag: <path d="M5 22V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0" />,
  external: <path d="M14 3h7v7m0-7L10 14m0-11H3v18h18v-7" />,
  reset: <path d="M3 10a9 9 0 1 1 2 8M3 3v7h7" />,
};

export function Icon({
  name,
  className = "w-5 h-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={`shrink-0 inline-block stroke-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconNodes[name]}
    </svg>
  );
}
