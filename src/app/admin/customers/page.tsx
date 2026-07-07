import AdminTable from "@/components/admin/AdminTable";
import { SectionCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { getCustomers } from "../queries";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

  const rows = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    orders: c.orderCount,
    spent: c.spent,
    createdAt: c.createdAt,
  }));

  return (
    <>
      <h1 className="text-xl font-bold">{adminFa.pageTitles.customers}</h1>
      <SectionCard title={adminFa.pageTitles.customers} description={adminFa.pageSubs.customers}>
        <AdminTable
          rows={rows}
          empty={adminFa.empty.customers}
          searchKeys={["name", "email", "phone"]}
          labels={{ search: adminFa.table.search, allStatuses: adminFa.table.allStatuses }}
          columns={[
            { key: "name", header: adminFa.cols.customer, type: "text" },
            { key: "email", header: adminFa.cols.email, type: "text" },
            { key: "phone", header: adminFa.cols.phone, type: "text" },
            { key: "orders", header: adminFa.cols.orders, type: "number" },
            { key: "spent", header: adminFa.cols.spent, type: "money" },
            { key: "createdAt", header: adminFa.cols.joined, type: "date" },
          ]}
        />
      </SectionCard>
    </>
  );
}
