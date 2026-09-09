// Format a Toman amount for display (e.g. 50,000,000 تومان).
export function formatRial(amount: number): string {
  return `${amount.toLocaleString("en-US")} تومان`;
}

// A price in a real currency, e.g. formatMoney(100, "AUD") -> "A$100". Used for
// the international course fee, where "A$" must be unambiguous in both languages.
export function formatMoney(amount: number, currency = "AUD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Same amount with an English label, for the English side of bilingual pages.
export function formatTomanEn(amount: number): string {
  return `${amount.toLocaleString("en-US")} Toman`;
}

export function formatDate(d: Date | null): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

// Date + time in the business timezone (defaults to Sydney; the admin can
// change the schedule timezone, which callers pass through).
export function formatDateTime(d: Date | string | null, timeZone = "Australia/Sydney"): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(date);
}
