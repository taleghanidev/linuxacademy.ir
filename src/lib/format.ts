// Format a Toman amount for display (e.g. 50,000,000 تومان).
export function formatRial(amount: number): string {
  return `${amount.toLocaleString("en-US")} تومان`;
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
