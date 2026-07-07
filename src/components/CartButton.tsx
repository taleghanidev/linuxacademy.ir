"use client";

import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Link } from "@/lib/router";

/**
 * Minimal floating cart toggle: a small icon pinned top-end with a live
 * item-count badge. Hidden on the cart page itself.
 */
export default function CartButton() {
  const { count } = useCart();
  const pathname = usePathname();
  if (pathname === "/cart") return null;

  return (
    <Link
      to="/cart"
      aria-label="Cart"
      className="fixed end-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-sm backdrop-blur transition-colors hover:border-brand-purple hover:text-brand-purple"
    >
      <ShoppingCart className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-magenta px-1 text-[10px] font-bold leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
