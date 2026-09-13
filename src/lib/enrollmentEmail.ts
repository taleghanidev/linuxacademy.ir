import { getCourse } from "@/config/courses";
import type { CourseEnrollment } from "@/db";
import { type EnrollmentEmailKind, sendEnrollmentEmail } from "@/lib/email";
import { formatCourseDate } from "@/lib/format";
import aiAgentCourseFa from "@/language/fa/pages/aiAgentCourse";

// Course facts in Persian for the student emails, keyed by course slug.
const COURSE_COPY: Record<string, { title: string; schedule: string }> = {
  "ai-agent-course": {
    title: aiAgentCourseFa.title,
    schedule: aiAgentCourseFa.quickFacts.when.value,
  },
};

/**
 * Emails the student about their enrollment. Returns false when there is
 * nothing to send to (email is optional) or Resend did not accept it.
 */
export async function emailStudent(
  kind: EnrollmentEmailKind,
  row: Pick<
    CourseEnrollment,
    "email" | "fullName" | "courseSlug" | "reviewNote"
  >,
): Promise<boolean> {
  if (!row.email) return false;
  const course = getCourse(row.courseSlug);
  const copy = COURSE_COPY[row.courseSlug];
  return sendEnrollmentEmail(kind, {
    to: row.email,
    fullName: row.fullName,
    courseTitle: copy?.title ?? row.courseSlug,
    startDate: course ? formatCourseDate(course.startDate, true) : "",
    schedule: copy?.schedule ?? "",
    reviewNote: row.reviewNote,
  });
}
