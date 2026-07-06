import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CustomerCell, DataTable, SectionCard, StatCard, StatusBadge } from "@/components/admin/ui";
import { formatDate, formatRial } from "@/lib/format";
import { getBookings, getOrdersDetailed, getSponsorships } from "./queries";

export const dynamic = "force-dynamic";

// Restrict the dashboard to CLERK_ADMIN_EMAILS (comma-separated). Only *verified*
// emails count, and if no allowlist is configured we fail closed in production.
async function assertAdmin() {
  const allowed = (process.env.CLERK_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) {
    if (process.env.NODE_ENV === "production") notFound();
    return;
  }

  const user = await currentUser();
  const verifiedEmails = (user?.emailAddresses ?? [])
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress.toLowerCase());

  if (!verifiedEmails.some((e) => allowed.includes(e))) notFound();
}

type Session = { start: string };

function sessionsOf(meta: unknown): Session[] {
  return ((meta as Record<string, unknown>)?.sessions as Session[] | undefined) ?? [];
}

export default async function AdminPage() {
  await assertAdmin();

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

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-magenta text-sm font-bold text-white">
              LA
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Linux Academy — Admin</h1>
              <p className="text-xs text-gray-400">Orders, bookings & sponsorships</p>
            </div>
          </div>
          <UserButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard label="Revenue (paid)" value={formatRial(revenue)} accent="green" icon="💰" />
          <StatCard
            label="Paid orders"
            value={String(paidOrders.length)}
            sub={`${pendingOrders.length} pending`}
            accent="purple"
            icon="🧾"
          />
          <StatCard
            label="Sessions"
            value={`${sessionsScheduled}/${sessionsSold}`}
            sub="scheduled / sold"
            accent="cyan"
            icon="📅"
          />
          <StatCard
            label="Sponsors"
            value={String(paidSponsors.length)}
            sub={`${sponsorships.length} total`}
            accent="magenta"
            icon="📣"
          />
          <StatCard label="Discounts given" value={formatRial(discounts)} accent="amber" icon="🏷️" />
        </div>

        {/* Orders */}
        <SectionCard title="Orders" description="Every checkout, newest first.">
          <DataTable
            rows={orders}
            rowKey={(o) => o.id}
            empty="No orders yet."
            columns={[
              {
                header: "Customer",
                cell: (o) => (
                  <CustomerCell
                    name={o.customerName}
                    email={o.customerEmail}
                    phone={o.customerPhone}
                  />
                ),
              },
              {
                header: "Items",
                cell: (o) => <span className="text-gray-600">{o.itemsSummary}</span>,
              },
              {
                header: "Total",
                cell: (o) => (
                  <div>
                    <div className="font-medium">{formatRial(o.total)}</div>
                    {o.discount > 0 && (
                      <div className="text-xs text-green-600">
                        −{formatRial(o.discount)} {o.couponCode && `(${o.couponCode})`}
                      </div>
                    )}
                  </div>
                ),
              },
              { header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
              { header: "Ref", cell: (o) => <span dir="ltr">{o.refId ?? "—"}</span> },
              { header: "Date", cell: (o) => formatDate(o.createdAt) },
            ]}
          />
        </SectionCard>

        {/* Bookings */}
        <SectionCard
          title="Consultation bookings"
          description="Purchased hours and their scheduled sessions."
        >
          <DataTable
            rows={bookings}
            rowKey={(b) => b.id}
            empty="No bookings yet."
            columns={[
              {
                header: "Customer",
                cell: (b) => (
                  <CustomerCell
                    name={b.customerName}
                    email={b.customerEmail}
                    phone={b.customerPhone}
                  />
                ),
              },
              { header: "Package", cell: (b) => b.label },
              {
                header: "Sessions",
                cell: (b) => {
                  const done = sessionsOf(b.meta).length;
                  return (
                    <span className={done >= b.quantity ? "text-green-600" : ""}>
                      {done}/{b.quantity}
                    </span>
                  );
                },
              },
              {
                header: "Next session",
                cell: (b) => {
                  const next = sessionsOf(b.meta)
                    .map((s) => new Date(s.start))
                    .filter((d) => d > new Date())
                    .sort((a, z) => a.getTime() - z.getTime())[0];
                  return next ? formatDate(next) : "—";
                },
              },
              { header: "Amount", cell: (b) => formatRial(b.amount) },
              {
                header: "Note",
                cell: (b) => (
                  <div className="max-w-48 whitespace-pre-wrap break-words text-gray-500">
                    {typeof (b.meta as Record<string, unknown>)?.note === "string"
                      ? ((b.meta as Record<string, unknown>).note as string)
                      : "—"}
                  </div>
                ),
              },
              { header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
              { header: "Date", cell: (b) => formatDate(b.createdAt) },
            ]}
          />
        </SectionCard>

        {/* Sponsors */}
        <SectionCard title="Ad / sponsorship buyers" description="Who bought which tier.">
          <DataTable
            rows={sponsorships}
            rowKey={(s) => s.id}
            empty="No sponsors yet."
            columns={[
              {
                header: "Customer",
                cell: (s) => (
                  <CustomerCell
                    name={s.customerName}
                    email={s.customerEmail}
                    phone={s.customerPhone}
                  />
                ),
              },
              { header: "Tier", cell: (s) => s.label },
              { header: "Qty", cell: (s) => s.quantity },
              { header: "Amount", cell: (s) => formatRial(s.amount) },
              { header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
              { header: "Ref", cell: (s) => <span dir="ltr">{s.refId ?? "—"}</span> },
              { header: "Date", cell: (s) => formatDate(s.createdAt) },
            ]}
          />
        </SectionCard>
      </main>
    </div>
  );
}
