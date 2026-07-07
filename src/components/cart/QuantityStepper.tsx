"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  decreaseLabel?: string;
  increaseLabel?: string;
  className?: string;
};

/**
 * Reusable +/- quantity control. Clamps to [min, max] and disables the
 * boundary button. Presentational: it only emits the next value via onChange.
 */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
  disabled = false,
  decreaseLabel = "decrease",
  increaseLabel = "increase",
  className,
}: QuantityStepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-brand-purple/10 hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || atMin}
        aria-label={decreaseLabel}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || atMax}
        aria-label={increaseLabel}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
