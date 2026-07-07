"use client";

import { CalendarClock, Megaphone, Trash2 } from "lucide-react";
import type { CartItemType } from "@/lib/cart";
import { cn } from "@/lib/utils";
import Money from "./Money";
import QuantityStepper from "./QuantityStepper";

const TYPE_ICON: Record<CartItemType, typeof CalendarClock> = {
  booking: CalendarClock,
  sponsorship: Megaphone,
};

export type CartLineItemProps = {
  label: string;
  type: CartItemType;
  typeLabel: string;
  unitPrice: number;
  quantity: number;
  currency: string;
  min?: number;
  max?: number;
  /** e.g. "ساعت" / "hours" — the unit shown next to the quantity. */
  unitLabel?: string;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  removeLabel?: string;
  decreaseLabel?: string;
  increaseLabel?: string;
};

/** A single cart line: type badge, price breakdown, quantity stepper, line total, remove. */
export default function CartLineItem({
  label,
  type,
  typeLabel,
  unitPrice,
  quantity,
  currency,
  min,
  max,
  unitLabel,
  onQuantityChange,
  onRemove,
  removeLabel = "remove",
  decreaseLabel,
  increaseLabel,
}: CartLineItemProps) {
  const Icon = TYPE_ICON[type] ?? CalendarClock;

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      {/* Accent bar */}
      <span
        className={cn(
          "absolute inset-y-0 start-0 w-1",
          type === "sponsorship" ? "bg-brand-magenta" : "bg-brand-purple",
        )}
        aria-hidden
      />

      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          type === "sponsorship"
            ? "bg-brand-magenta/10 text-brand-magenta"
            : "bg-brand-purple/10 text-brand-purple",
        )}
        aria-hidden
      >
        <Icon className="h-6 w-6" />
      </div>

      {/* Title + unit price */}
      <div className="min-w-0 flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-gray-900">{label}</h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
              type === "sponsorship"
                ? "bg-brand-magenta/10 text-brand-magenta-dark"
                : "bg-brand-purple/10 text-brand-purple-dark",
            )}
          >
            {typeLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          <Money amount={unitPrice} currency={currency} />
          {unitLabel ? ` / ${unitLabel}` : ""} × {quantity}
        </p>
      </div>

      {/* Stepper */}
      <QuantityStepper
        value={quantity}
        onChange={onQuantityChange}
        min={min}
        max={max}
        decreaseLabel={decreaseLabel}
        increaseLabel={increaseLabel}
      />

      {/* Line total */}
      <div className="w-32 shrink-0 text-end font-semibold text-gray-900">
        <Money amount={unitPrice * quantity} currency={currency} />
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label={removeLabel}
        title={removeLabel}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
