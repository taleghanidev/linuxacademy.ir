"use client";

import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

type CartButtonProps = {
  /**
   * "floating" pins the button top-end of the viewport (pages without a site
   * nav). "inline" sits in the NavBar's own row so it never covers the logo;
   * when a NavBar is present the floating one is hidden via globals.css.
   */
  variant?: "floating" | "inline";
};

/**
 * Minimal cart toggle: a small icon with a live item-count badge. Hidden on
 * the cart page itself.
 */
export default function CartButton({ variant = "floating" }: CartButtonProps) {
  const { count } = useCart();
  const pathname = usePathname();
  if (pathname === "/cart") return null;

  return (
    <Link
      to="/cart"
      aria-label="Cart"
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-sm backdrop-blur transition-colors hover:border-brand-purple hover:text-brand-purple",
        variant === "floating" ? "site-cart-floating fixed end-4 top-4 z-50" : "relative shrink-0",
      )}
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
