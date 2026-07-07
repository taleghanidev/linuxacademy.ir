"use client";

import { BadgePercent, Check } from "lucide-react";
import Money from "./Money";

export type CouponFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  label: string;
  placeholder: string;
  applyLabel: string;
  currency: string;
  /** Validation error message, if any. */
  error?: string | null;
  /** Applied coupon code, if any. */
  appliedCode?: string | null;
  /** Discount amount granted by the applied coupon. */
  discount?: number;
};

/** Reusable coupon input with apply button + applied/error feedback. */
export default function CouponField({
  value,
  onChange,
  onApply,
  label,
  placeholder,
  applyLabel,
  currency,
  error,
  appliedCode,
  discount = 0,
}: CouponFieldProps) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <BadgePercent className="h-4 w-4 text-brand-purple" />
        {label}
      </label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onApply();
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-grow rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
        />
        <button
          type="button"
          onClick={onApply}
          className="shrink-0 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-brand-purple hover:text-brand-purple"
        >
          {applyLabel}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {appliedCode && !error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-green-600">
          <Check className="h-3.5 w-3.5" />
          <span className="font-mono uppercase">{appliedCode}</span>
          <span>
            −<Money amount={discount} currency={currency} />
          </span>
        </p>
      )}
    </div>
  );
}
