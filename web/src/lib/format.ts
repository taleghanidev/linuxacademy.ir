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
