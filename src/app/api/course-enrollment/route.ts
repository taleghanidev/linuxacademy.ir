import { put } from "@vercel/blob";
import { z } from "zod";
import { getCourse, type PayRegion } from "@/config/courses";
import { courseEnrollments, db } from "@/db";
import { notifyCourseEnrollment } from "@/lib/email";
import { allowRequest, enrollmentLimiter } from "@/lib/ratelimit";

// Registration for a course: the student transfers the fee to the bank account
// shown on the page, then posts this form with a photo of the receipt. The
// receipt goes to Vercel Blob, the row goes to Postgres as PENDING_REVIEW, and
// the owner gets an email. An admin confirms the seat after checking the image.

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

const fieldsSchema = z.object({
  courseSlug: z.string().min(1, "unknown_course").max(100),
  fullName: z.string().trim().min(2, "name_too_short").max(120),
  email: z.string().trim().toLowerCase().email("invalid_email").max(200).or(z.literal("")),
  // International format from the country-code picker: "+98 9123456789".
  phone: z
    .string()
    .trim()
    .max(24)
    .regex(/^\+\d{1,4} \d{6,14}$/, "invalid_phone"),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  // Which account they were shown; decides the currency and the amount owed.
  payRegion: z.enum(["iran", "international"]).catch("iran"),
});

function fail(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  if (!(await allowRequest(enrollmentLimiter, request))) {
    return fail("rate_limited", 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("bad_request", 400);
  }

  // Missing fields arrive as null. Coerce to "" so the length/format rules
  // fire and return our own error codes, rather than a raw validator message.
  const str = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : "";
  };
  const parsed = fieldsSchema.safeParse({
    courseSlug: str("courseSlug"),
    fullName: str("fullName"),
    email: str("email"),
    phone: str("phone"),
    note: str("note"),
    payRegion: str("payRegion"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "invalid_fields", 400);
  }
  const { courseSlug, fullName, email, phone, note, payRegion } = parsed.data;

  // The price is taken from the server-side catalogue, never from the client.
  // The client only says which region it was shown; the amount comes from here.
  const course = getCourse(courseSlug);
  if (!course) return fail("unknown_course", 400);
  const region: PayRegion = payRegion;
  const amount = region === "international" ? course.priceAud : course.price;
  const currency = region === "international" ? "AUD" : "IRT";

  const receipt = form.get("receipt");
  if (!(receipt instanceof File) || receipt.size === 0) return fail("receipt_required", 400);
  if (receipt.size > MAX_BYTES) return fail("receipt_too_large", 400);
  if (!ACCEPTED.includes(receipt.type)) return fail("receipt_bad_type", 400);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set; cannot store the receipt.");
    return fail("storage_unavailable", 503);
  }

  let receiptUrl: string;
  try {
    const ext = receipt.name.includes(".") ? receipt.name.split(".").pop() : "jpg";
    // addRandomSuffix keeps the path unguessable, so a receipt cannot be found
    // by trying names. Blob URLs are public but effectively unlisted.
    const blob = await put(`course-receipts/${courseSlug}/${Date.now()}.${ext}`, receipt, {
      access: "public",
      addRandomSuffix: true,
      contentType: receipt.type,
    });
    receiptUrl = blob.url;
  } catch (err) {
    console.error("Receipt upload failed:", err);
    return fail("upload_failed", 502);
  }

  let id: string;
  try {
    const [row] = await db
      .insert(courseEnrollments)
      .values({
        courseSlug,
        fullName,
        email,
        phone,
        note: note || null,
        amount,
        currency,
        payRegion: region,
        receiptUrl,
        receiptName: receipt.name.slice(0, 200),
        receiptSize: receipt.size,
      })
      .returning({ id: courseEnrollments.id });
    id = row.id;
  } catch (err) {
    console.error("Enrollment insert failed:", err);
    return fail("server_error", 500);
  }

  // Best effort: a failed notification must not lose a paid registration.
  await notifyCourseEnrollment({
    id,
    courseSlug,
    fullName,
    email,
    phone,
    amount,
    currency,
    receiptUrl,
  }).catch((err) => console.error("Enrollment email failed:", err));

  return Response.json({ ok: true, id }, { status: 201 });
}
