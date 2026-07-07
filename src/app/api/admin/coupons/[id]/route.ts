import { eq } from "drizzle-orm";
import { z } from "zod";
import { coupons, db } from "@/db";
import { isAdmin } from "@/lib/admin";

const patchSchema = z.object({
  active: z.boolean().optional(),
  value: z.coerce.number().int().positive().optional(),
  minSubtotal: z.coerce.number().int().min(0).optional(),
  appliesTo: z.enum(["all", "booking", "sponsorship"]).optional(),
  usageLimit: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.string().trim().optional().nullable(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  const d = parsed.data;
  if (d.active !== undefined) patch.active = d.active;
  if (d.value !== undefined) patch.value = d.value;
  if (d.minSubtotal !== undefined) patch.minSubtotal = d.minSubtotal;
  if (d.appliesTo !== undefined) patch.appliesTo = d.appliesTo;
  if (d.usageLimit !== undefined) patch.usageLimit = d.usageLimit;
  if (d.expiresAt !== undefined) {
    const exp = d.expiresAt ? new Date(d.expiresAt) : null;
    if (exp && Number.isNaN(exp.getTime())) {
      return Response.json({ error: "invalid_date" }, { status: 400 });
    }
    patch.expiresAt = exp;
  }

  const [row] = await db.update(coupons).set(patch).where(eq(coupons.id, id)).returning();
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ coupon: row });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  const [row] = await db.delete(coupons).where(eq(coupons.id, id)).returning();
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ ok: true });
}
