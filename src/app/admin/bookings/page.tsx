import AdminTable from "@/components/admin/AdminTable";
import { SectionCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { formatDateTime } from "@/lib/format";
import { getBookings } from "../queries";

export const dynamic = "force-dynamic";

type Session = { start: string };
function sessionsOf(meta: unknown): Session[] {
  return ((meta as Record<string, unknown>)?.sessions as Session[] | undefined) ?? [];
}
function noteOf(meta: unknown): string {
  const n = (meta as Record<string, unknown>)?.note;
  return typeof n === "string" && n.trim() ? n : "—";
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  const rows = bookings.map((b) => {
    const sessions = sessionsOf(b.meta)
      .map((s) => new Date(s.start))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, z) => a.getTime() - z.getTime());
    const now = Date.now();
    const next = sessions.find((d) => d.getTime() > now) ?? null;

    return {
      id: b.id,
      customer: { name: b.customerName, email: b.customerEmail, phone: b.customerPhone },
      package: b.label,
      sessions: `${sessions.length}/${b.quantity}`,
      nextSession: next ? next.toISOString() : "",
      // Every scheduled session's date + time (Sydney tz), one per line.
      bookingTimes: sessions.length ? sessions.map((d) => formatDateTime(d)).join("\n") : "—",
      note: noteOf(b.meta),
      amount: b.amount,
      status: b.status,
      createdAt: b.createdAt,
    };
  });

  return (
    <>
      <h1 className="text-xl font-bold">{adminFa.pageTitles.bookings}</h1>
      <SectionCard title={adminFa.pageTitles.bookings} description={adminFa.pageSubs.bookings}>
        <AdminTable
          rows={rows}
          empty={adminFa.empty.bookings}
          statusKey="status"
          statusLabels={adminFa.status}
          searchKeys={["customer", "package", "note"]}
          labels={{ search: adminFa.table.search, allStatuses: adminFa.table.allStatuses }}
          columns={[
            { key: "customer", header: adminFa.cols.customer, type: "customer", sortable: false },
            { key: "package", header: adminFa.cols.package, type: "text" },
            { key: "sessions", header: adminFa.cols.sessions, type: "text" },
            { key: "nextSession", header: adminFa.cols.nextSession, type: "date" },
            {
              key: "bookingTimes",
              header: adminFa.cols.bookingTimes,
              type: "text",
              sortable: false,
            },
            { key: "amount", header: adminFa.cols.amount, type: "money" },
            { key: "note", header: adminFa.cols.note, type: "text", sortable: false },
            { key: "status", header: adminFa.cols.status, type: "status" },
            { key: "createdAt", header: adminFa.cols.date, type: "date" },
          ]}
        />
      </SectionCard>
    </>
  );
}
