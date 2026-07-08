"use client";

import {
  BadgePercent,
  CalendarClock,
  Clock,
  LayoutDashboard,
  Megaphone,
  Receipt,
  Users,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import adminFa from "@/language/fa/admin";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", key: "overview", Icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", key: "orders", Icon: Receipt, exact: false },
  { href: "/admin/bookings", key: "bookings", Icon: CalendarClock, exact: false },
  { href: "/admin/sponsors", key: "sponsors", Icon: Megaphone, exact: false },
  { href: "/admin/customers", key: "customers", Icon: Users, exact: false },
  { href: "/admin/coupons", key: "coupons", Icon: BadgePercent, exact: false },
  { href: "/admin/schedule", key: "schedule", Icon: Clock, exact: false },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-s bg-white lg:flex">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-magenta text-sm font-bold text-white">
          LA
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">{adminFa.brand}</div>
          <div className="text-xs text-gray-400">{adminFa.brandSub}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, key, Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href as unknown as Route}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-purple/10 text-brand-purple"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {adminFa.nav[key]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
