import { BadgePercent, CalendarClock, DollarSign, Megaphone, Receipt } from "lucide-react";
import AdminTable from "@/components/admin/AdminTable";
import { type ChartBucket, MiniBarChart, SectionCard, StatCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { formatRial } from "@/lib/format";
import { getBookings, getOrdersDetailed, getSponsorships } from "./queries";

export const dynamic = "force-dynamic";

type Session = { start: string };
function sessionsOf(meta: unknown): Session[] {
  return ((meta as Record<string, unknown>)?.sessions as Session[] | undefined) ?? [];
}

// Bucket a date by business-timezone (Sydney) calendar day, e.g. "2026-07-08".
const dayKey = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

const faDay = new Intl.DateTimeFormat("fa-IR", {
  timeZone: "Australia/Sydney",
  day: "numeric",
  month: "short",
});

function revenueBuckets(
  orders: { createdAt: Date; total: number; status: string }[],
  days = 14,
): ChartBucket[] {
  const paid = orders.filter((o) => o.status === "PAID");
  const byDay = new Map<string, number>();
  for (const o of paid) {
    const k = dayKey(o.createdAt);
    byDay.set(k, (byDay.get(k) ?? 0) + o.total);
  }
  const now = Date.now();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now - (days - 1 - i) * 86_400_000);
    const value = byDay.get(dayKey(d)) ?? 0;
    return { label: faDay.format(d), value, display: formatRial(value) };
  });
}

export default async function OverviewPage() {
  const [bookings, sponsorships, orders] = await Promise.all([
    getBookings(),
    getSponsorships(),
    getOrdersDetailed(),
  ]);

  const paidOrders = orders.filter((o) => o.status === "PAID");
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const discounts = paidOrders.reduce((s, o) => s + o.discount, 0);

  const todayKey = dayKey(new Date());
  const monthKey = todayKey.slice(0, 7);
  const revenueToday = paidOrders
    .filter((o) => dayKey(o.createdAt) === todayKey)
    .reduce((s, o) => s + o.total, 0);
  const revenueMonth = paidOrders
    .filter((o) => dayKey(o.createdAt).startsWith(monthKey))
    .reduce((s, o) => s + o.total, 0);
  const buckets = revenueBuckets(orders);

  const paidBookings = bookings.filter((b) => b.status === "PAID");
  const sessionsSold = paidBookings.reduce((s, b) => s + b.quantity, 0);
  const sessionsScheduled = paidBookings.reduce((s, b) => s + sessionsOf(b.meta).length, 0);
  const paidSponsors = sponsorships.filter((s) => s.status === "PAID");

  const recentRows = orders.slice(0, 8).map((o) => ({
    id: o.id,
    customer: { name: o.customerName, email: o.customerEmail, phone: o.customerPhone },
    items: o.itemsSummary,
    method: adminFa.payments.zarinpal,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt,
  }));

  return (
    <>
      <h1 className="text-xl font-bold">{adminFa.pageTitles.overview}</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label={adminFa.stats.revenue}
          value={formatRial(revenue)}
          sub={`${adminFa.stats.today}: ${formatRial(revenueToday)} · ${adminFa.stats.thisMonth}: ${formatRial(revenueMonth)}`}
          accent="green"
          icon={<DollarSign className="h-4 w-4" />}
          href="/admin/orders"
        />
        <StatCard
          label={adminFa.stats.paidOrders}
          value={String(paidOrders.length)}
          sub={`${pendingOrders.length} ${adminFa.stats.pending}`}
          accent="purple"
          icon={<Receipt className="h-4 w-4" />}
          href="/admin/orders"
        />
        <StatCard
          label={adminFa.stats.sessions}
          value={`${sessionsScheduled}/${sessionsSold}`}
          sub={adminFa.stats.scheduledSold}
          accent="cyan"
          icon={<CalendarClock className="h-4 w-4" />}
          href="/admin/bookings"
        />
        <StatCard
          label={adminFa.stats.sponsors}
          value={String(paidSponsors.length)}
          sub={`${sponsorships.length} ${adminFa.stats.total}`}
          accent="magenta"
          icon={<Megaphone className="h-4 w-4" />}
          href="/admin/sponsors"
        />
        <StatCard
          label={adminFa.stats.discounts}
          value={formatRial(discounts)}
          accent="amber"
          icon={<BadgePercent className="h-4 w-4" />}
          href="/admin/coupons"
        />
      </div>

      <SectionCard title={adminFa.stats.revenue14d}>
        <MiniBarChart buckets={buckets} />
      </SectionCard>

      <SectionCard title={adminFa.stats.recentOrders} description={adminFa.pageSubs.orders}>
        <AdminTable
          rows={recentRows}
          empty={adminFa.empty.orders}
          statusKey="status"
          statusLabels={adminFa.status}
          searchKeys={["customer", "items"]}
          labels={{ search: adminFa.table.search, allStatuses: adminFa.table.allStatuses }}
          columns={[
            { key: "customer", header: adminFa.cols.customer, type: "customer", sortable: false },
            { key: "items", header: adminFa.cols.items, type: "text", sortable: false },
            { key: "method", header: adminFa.cols.method, type: "text" },
            { key: "total", header: adminFa.cols.total, type: "money" },
            { key: "status", header: adminFa.cols.status, type: "status" },
            { key: "createdAt", header: adminFa.cols.date, type: "date" },
          ]}
        />
      </SectionCard>
    </>
  );
}
