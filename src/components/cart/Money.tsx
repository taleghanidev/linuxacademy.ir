import { cn } from "@/lib/utils";

/** Format an integer amount with thousands separators + currency word. */
export function formatMoney(amount: number, currency: string): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(amount))} ${currency}`;
}

export type MoneyProps = {
  amount: number;
  currency: string;
  /** Prefix with a minus sign (for discounts). */
  negative?: boolean;
  className?: string;
};

/** Reusable money label. Digits stay LTR via `bdi` so they render correctly inside RTL. */
export default function Money({ amount, currency, negative, className }: MoneyProps) {
  return (
    <bdi className={cn("tabular-nums", className)}>
      {negative ? "−" : ""}
      {formatMoney(amount, currency)}
    </bdi>
  );
}
