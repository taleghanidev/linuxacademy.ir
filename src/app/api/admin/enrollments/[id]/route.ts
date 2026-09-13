import { eq } from "drizzle-orm";
import { z } from "zod";
import { courseEnrollments, db } from "@/db";
import { isAdmin } from "@/lib/admin";
import { emailStudent } from "@/lib/enrollmentEmail";

// Admin review of a course enrollment:
//   confirm / reject: set the status, stamp the review, and email the student.
//   pending:          put it back in the review queue (no email).
//   email:            resend the email that matches the current status.
const bodySchema = z.object({
  action: z.enum(["confirm", "reject", "pending", "email"]),
  reviewNote: z.string().trim().max(1000).optional(),
  /** Whether confirm/reject should email the student. Defaults to yes. */
  notify: z.boolean().optional(),
});

const STATUS = {
  confirm: "CONFIRMED",
  reject: "REJECTED",
  pending: "PENDING_REVIEW",
} as const;
const EMAIL_FOR = {
  CONFIRMED: "confirmed",
  REJECTED: "rejected",
  PENDING_REVIEW: "received",
} as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: "invalid" }, { status: 400 });
  const { action, reviewNote, notify = true } = parsed.data;

  let row;
  if (action === "email") {
    [row] = await db
      .select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.id, id));
  } else {
    [row] = await db
      .update(courseEnrollments)
      .set({
        status: STATUS[action],
        ...(reviewNote !== undefined ? { reviewNote: reviewNote || null } : {}),
        reviewedAt: action === "pending" ? null : new Date(),
      })
      .where(eq(courseEnrollments.id, id))
      .returning();
  }
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });

  const shouldEmail = action === "email" || (notify && action !== "pending");
  const emailed = shouldEmail
    ? await emailStudent(EMAIL_FOR[row.status], row)
    : false;

  return Response.json({
    enrollment: row,
    emailed,
    hasEmail: Boolean(row.email),
  });
}
