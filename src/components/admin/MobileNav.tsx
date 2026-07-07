"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import adminFa from "@/language/fa/admin";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", key: "overview", exact: true },
  { href: "/admin/orders", key: "orders", exact: false },
  { href: "/admin/bookings", key: "bookings", exact: false },
  { href: "/admin/sponsors", key: "sponsors", exact: false },
  { href: "/admin/customers", key: "customers", exact: false },
  { href: "/admin/coupons", key: "coupons", exact: false },
] as const;

/** Horizontal scrollable nav for small screens (sidebar is hidden below lg). */
export default function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-t px-3 py-2 lg:hidden">
      {NAV.map(({ href, key, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href as unknown as Route}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "bg-brand-purple/10 text-brand-purple" : "text-gray-500 hover:bg-gray-100",
            )}
          >
            {adminFa.nav[key]}
          </Link>
        );
      })}
    </nav>
  );
}
