"use client";

import Money from "./Money";

export type OrderTotalsProps = {
  subtotal: number;
  discount?: number;
  total: number;
  currency: string;
  labels: {
    subtotal: string;
    discount: string;
    total: string;
  };
};

/** Reusable subtotal / discount / total block. */
export default function OrderTotals({
  subtotal,
  discount = 0,
  total,
  currency,
  labels,
}: OrderTotalsProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>{labels.subtotal}</span>
        <Money amount={subtotal} currency={currency} />
      </div>
      {discount > 0 && (
        <div className="flex justify-between font-medium text-green-600">
          <span>{labels.discount}</span>
          <Money amount={discount} currency={currency} negative />
        </div>
      )}
      <div className="mt-3 flex items-end justify-between border-t border-dashed border-gray-200 pt-3">
        <span className="text-base font-bold text-gray-900">{labels.total}</span>
        <Money
          amount={total}
          currency={currency}
          className="text-xl font-extrabold text-gray-900"
        />
      </div>
    </div>
  );
}
