"use client";

import { ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";

export type EmptyCartProps = {
  message: string;
  /** CTA node (e.g. a router Link) — kept as a prop so this stays router-agnostic. */
  action?: ReactNode;
};

/** Reusable empty-cart state. */
export default function EmptyCart({ message, action }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-purple/10">
        <ShoppingCart className="h-9 w-9 text-brand-purple" />
      </div>
      <p className="mb-6 text-gray-600">{message}</p>
      {action}
    </div>
  );
}
