const COUNTRY_CODES: Record<string, string> = {
  Kyrgyzstan: "KG",
  Uzbekistan: "UZ",
  Kazakhstan: "KZ",
  Russia: "RU",
};

/**
 * Small country stamp used in the register, filters and comparison table.
 * This is the page signature, not a badge with its own color system.
 */
export function CountryStamp({
  country,
  dark = false,
}: {
  country: string;
  dark?: boolean;
}) {
  const code = COUNTRY_CODES[country] ?? country.slice(0, 2).toUpperCase();

  return (
    <span
      aria-hidden
      className={`inline-flex size-6 shrink-0 items-center justify-center rounded border text-xs font-medium tabular-nums ${
        dark
          ? "border-white/20 text-white/75"
          : "border-brand-hairline text-brand-ink"
      }`}
    >
      {code}
    </span>
  );
}
