import AdminTable from "@/components/admin/AdminTable";
import { SectionCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { getOrdersDetailed } from "../queries";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrdersDetailed();

  const rows = orders.map((o) => ({
    id: o.id,
    customer: { name: o.customerName, email: o.customerEmail, phone: o.customerPhone },
    items: o.itemsSummary,
    method: adminFa.payments.zarinpal,
    total: o.total,
    discount: o.discount > 0 ? o.discount : 0,
    coupon: o.couponCode ?? "—",
    status: o.status,
    ref: o.refId ?? "—",
    createdAt: o.createdAt,
  }));

  return (
    <>
      <h1 className="text-xl font-bold">{adminFa.pageTitles.orders}</h1>
      <SectionCard title={adminFa.pageTitles.orders} description={adminFa.pageSubs.orders}>
        <AdminTable
          rows={rows}
          empty={adminFa.empty.orders}
          statusKey="status"
          statusLabels={adminFa.status}
          searchKeys={["customer", "items", "ref", "coupon"]}
          labels={{ search: adminFa.table.search, allStatuses: adminFa.table.allStatuses }}
          columns={[
            { key: "customer", header: adminFa.cols.customer, type: "customer", sortable: false },
            { key: "items", header: adminFa.cols.items, type: "text", sortable: false },
            { key: "method", header: adminFa.cols.method, type: "text" },
            { key: "total", header: adminFa.cols.total, type: "money" },
            { key: "discount", header: adminFa.cols.discount, type: "money" },
            { key: "status", header: adminFa.cols.status, type: "status" },
            { key: "ref", header: adminFa.cols.ref, type: "text" },
            { key: "createdAt", header: adminFa.cols.date, type: "date" },
          ]}
        />
      </SectionCard>
    </>
  );
}
