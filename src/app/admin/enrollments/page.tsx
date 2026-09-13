import EnrollmentManager from "@/components/admin/EnrollmentManager";
import { SectionCard } from "@/components/admin/ui";
import adminFa from "@/language/fa/admin";
import { getCourseEnrollments } from "../queries";

export const dynamic = "force-dynamic";

export default async function EnrollmentsPage() {
  const enrollments = await getCourseEnrollments();

  return (
    <>
      <h1 className="text-xl font-bold">{adminFa.pageTitles.enrollments}</h1>
      <SectionCard
        title={adminFa.pageTitles.enrollments}
        description={adminFa.pageSubs.enrollments}
      >
        <EnrollmentManager enrollments={enrollments} />
      </SectionCard>
    </>
  );
}
