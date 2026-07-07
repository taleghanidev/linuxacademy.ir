import AdminTable from "@/components/admin/AdminTable";
import { SectionCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { getSponsorships } from "../queries";

export const dynamic = "force-dynamic";

export default async function SponsorsPage() {
  const sponsorships = await getSponsorships();

  const rows = sponsorships.map((s) => ({
    id: s.id,
    customer: { name: s.customerName, email: s.customerEmail, phone: s.customerPhone },
    tier: s.label,
    qty: s.quantity,
    amount: s.amount,
    status: s.status,
    ref: s.refId ?? "—",
    createdAt: s.createdAt,
  }));

  return (
    <>
      <h1 className="text-xl font-bold">{adminFa.pageTitles.sponsors}</h1>
      <SectionCard title={adminFa.pageTitles.sponsors} description={adminFa.pageSubs.sponsors}>
        <AdminTable
          rows={rows}
          empty={adminFa.empty.sponsors}
          statusKey="status"
          statusLabels={adminFa.status}
          searchKeys={["customer", "tier", "ref"]}
          labels={{ search: adminFa.table.search, allStatuses: adminFa.table.allStatuses }}
          columns={[
            { key: "customer", header: adminFa.cols.customer, type: "customer", sortable: false },
            { key: "tier", header: adminFa.cols.tier, type: "text" },
            { key: "qty", header: adminFa.cols.qty, type: "number" },
            { key: "amount", header: adminFa.cols.amount, type: "money" },
            { key: "status", header: adminFa.cols.status, type: "status" },
            { key: "ref", header: adminFa.cols.ref, type: "text" },
            { key: "createdAt", header: adminFa.cols.date, type: "date" },
          ]}
        />
      </SectionCard>
    </>
  );
}
