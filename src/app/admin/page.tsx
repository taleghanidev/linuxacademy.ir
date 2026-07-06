import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { formatDate, formatRial } from "@/lib/format";
import { getBookings, getOrders, getSponsorships } from "./queries";

export const dynamic = "force-dynamic";

// Restrict the dashboard to CLERK_ADMIN_EMAILS (comma-separated). Only *verified*
// emails count, and if no allowlist is configured we fail closed in production.
async function assertAdmin() {
  const allowed = (process.env.CLERK_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) {
    // No allowlist set: allow in dev for convenience, deny in production.
    if (process.env.NODE_ENV === "production") notFound();
    return;
  }

  const user = await currentUser();
  const verifiedEmails = (user?.emailAddresses ?? [])
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress.toLowerCase());

  if (!verifiedEmails.some((e) => allowed.includes(e))) notFound();
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELED: "bg-gray-200 text-gray-700",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100"}`}
    >
      {status}
    </span>
  );
}

export default async function AdminPage() {
  await assertAdmin();

  const [bookingRows, sponsorshipRows, orderRows] = await Promise.all([
    getBookings(),
    getSponsorships(),
    getOrders(),
  ]);

  const paidOrders = orderRows.filter((o) => o.status === "PAID");
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserButton />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Paid orders" value={String(paidOrders.length)} />
        <Stat label="Bookings" value={String(bookingRows.length)} />
        <Stat label="Ad buyers" value={String(sponsorshipRows.length)} />
        <Stat label="Revenue (paid)" value={formatRial(revenue)} />
      </div>

      <section className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">Bookings</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <Th>Customer</Th>
                <Th>Contact</Th>
                <Th>Item</Th>
                <Th>Hours</Th>
                <Th>Amount</Th>
                <Th>Note</Th>
                <Th>Status</Th>
                <Th>Ref</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {bookingRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                    No bookings yet.
                  </td>
                </tr>
              )}
              {bookingRows.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <Td>{b.customerName}</Td>
                  <Td>
                    <div>{b.customerEmail}</div>
                    <div className="text-gray-400">{b.customerPhone}</div>
                  </Td>
                  <Td>{b.label}</Td>
                  <Td>{b.quantity}</Td>
                  <Td>{formatRial(b.amount)}</Td>
                  <Td>
                    <div className="max-w-48 whitespace-pre-wrap break-words text-gray-600">
                      {typeof b.meta?.note === "string" && b.meta.note ? b.meta.note : "—"}
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={b.status} />
                  </Td>
                  <Td>{b.refId ?? "—"}</Td>
                  <Td>{formatDate(b.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Ad / Sponsorship buyers</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <Th>Customer</Th>
                <Th>Contact</Th>
                <Th>Tier</Th>
                <Th>Qty</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Ref</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {sponsorshipRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                    No sponsors yet.
                  </td>
                </tr>
              )}
              {sponsorshipRows.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <Td>{s.customerName}</Td>
                  <Td>
                    <div>{s.customerEmail}</div>
                    <div className="text-gray-400">{s.customerPhone}</div>
                  </Td>
                  <Td>{s.label}</Td>
                  <Td>{s.quantity}</Td>
                  <Td>{formatRial(s.amount)}</Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                  <Td>{s.refId ?? "—"}</Td>
                  <Td>{formatDate(s.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 font-medium">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2 align-top">{children}</td>;
}
