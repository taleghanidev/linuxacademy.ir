import AdminTable from "@/components/admin/AdminTable";
import { SectionCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { getCourseEnrollments } from "../queries";

export const dynamic = "force-dynamic";

export default async function EnrollmentsPage() {
  const enrollments = await getCourseEnrollments();

  const rows = enrollments.map((e) => ({
    id: e.id,
    student: { name: e.fullName, email: e.email, phone: e.phone },
    course: e.courseSlug,
    amount: e.amount,
    status: e.status,
    receipt: { href: e.receiptUrl, label: adminFa.cols.receipt },
    note: e.note ?? "—",
    createdAt: e.createdAt,
  }));

  return (
    <>
      <h1 className="text-xl font-bold">{adminFa.pageTitles.enrollments}</h1>
      <SectionCard
        title={adminFa.pageTitles.enrollments}
        description={adminFa.pageSubs.enrollments}
      >
        <AdminTable
          rows={rows}
          empty={adminFa.empty.enrollments}
          statusKey="status"
          statusLabels={adminFa.status}
          searchKeys={["student", "course", "note"]}
          labels={{ search: adminFa.table.search, allStatuses: adminFa.table.allStatuses }}
          columns={[
            { key: "student", header: adminFa.cols.customer, type: "customer", sortable: false },
            { key: "course", header: adminFa.cols.course, type: "text" },
            { key: "amount", header: adminFa.cols.amount, type: "money" },
            { key: "receipt", header: adminFa.cols.receipt, type: "link", sortable: false },
            { key: "status", header: adminFa.cols.status, type: "status" },
            { key: "note", header: adminFa.cols.note, type: "text", sortable: false },
            { key: "createdAt", header: adminFa.cols.date, type: "date" },
          ]}
        />
      </SectionCard>
    </>
  );
}
