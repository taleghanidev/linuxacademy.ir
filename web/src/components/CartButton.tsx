"use client";

import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Link } from "@/lib/router";

// Floating cart button with a live item count. Hidden on the cart page itself.
export default function CartButton() {
  const { count } = useCart();
  const pathname = usePathname();
  if (pathname === "/cart") return null;

  return (
    <Link
      to="/cart"
      aria-label="Cart"
      className="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple text-white shadow-lg transition-transform hover:scale-105"
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-1 -end-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-magenta px-1 text-xs font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}
