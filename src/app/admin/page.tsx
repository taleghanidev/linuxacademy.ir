import { BadgePercent, CalendarClock, DollarSign, Megaphone, Receipt } from "lucide-react";
import AdminTable from "@/components/admin/AdminTable";
import { SectionCard, StatCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { formatRial } from "@/lib/format";
import { getBookings, getOrdersDetailed, getSponsorships } from "./queries";

export const dynamic = "force-dynamic";

type Session = { start: string };
function sessionsOf(meta: unknown): Session[] {
  return ((meta as Record<string, unknown>)?.sessions as Session[] | undefined) ?? [];
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
          accent="green"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label={adminFa.stats.paidOrders}
          value={String(paidOrders.length)}
          sub={`${pendingOrders.length} ${adminFa.stats.pending}`}
          accent="purple"
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatCard
          label={adminFa.stats.sessions}
          value={`${sessionsScheduled}/${sessionsSold}`}
          sub={adminFa.stats.scheduledSold}
          accent="cyan"
          icon={<CalendarClock className="h-4 w-4" />}
        />
        <StatCard
          label={adminFa.stats.sponsors}
          value={String(paidSponsors.length)}
          sub={`${sponsorships.length} ${adminFa.stats.total}`}
          accent="magenta"
          icon={<Megaphone className="h-4 w-4" />}
        />
        <StatCard
          label={adminFa.stats.discounts}
          value={formatRial(discounts)}
          accent="amber"
          icon={<BadgePercent className="h-4 w-4" />}
        />
      </div>

      <SectionCard title={adminFa.nav.orders} description={adminFa.pageSubs.orders}>
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
