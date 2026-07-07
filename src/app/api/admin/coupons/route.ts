import { desc } from "drizzle-orm";
import { z } from "zod";
import { coupons, db } from "@/db";
import { isAdmin } from "@/lib/admin";

const createSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1)
      .max(64)
      .transform((s) => s.toUpperCase()),
    type: z.enum(["percentage", "fixed"]),
    value: z.coerce.number().int().positive(),
    minSubtotal: z.coerce.number().int().min(0).default(0),
    appliesTo: z.enum(["all", "booking", "sponsorship"]).default("all"),
    active: z.boolean().default(true),
    expiresAt: z.string().trim().optional().nullable(),
    usageLimit: z.coerce.number().int().positive().optional().nullable(),
  })
  .refine((d) => d.type !== "percentage" || d.value <= 100, {
    message: "percentage must be ≤ 100",
    path: ["value"],
  });

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "forbidden" }, { status: 403 });
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return Response.json({ coupons: rows });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const expiresAt = d.expiresAt ? new Date(d.expiresAt) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return Response.json({ error: "invalid_date" }, { status: 400 });
  }

  try {
    const [row] = await db
      .insert(coupons)
      .values({
        code: d.code,
        type: d.type,
        value: d.value,
        minSubtotal: d.minSubtotal,
        appliesTo: d.appliesTo,
        active: d.active,
        expiresAt,
        usageLimit: d.usageLimit ?? null,
      })
      .returning();
    return Response.json({ coupon: row }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (/unique|duplicate/i.test(message)) {
      return Response.json({ error: "duplicate" }, { status: 409 });
    }
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
