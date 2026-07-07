// Server-side coupon source of truth: merges admin-managed codes from the
// database with the built-in static list, then evaluates with the shared
// pure `evaluateCoupon`. DB codes override static codes with the same code.

import { eq } from "drizzle-orm";
import {
  type CartLineForCoupon,
  COUPONS,
  type Coupon,
  type CouponResult,
  evaluateCoupon,
} from "@/config/coupons";
import { type CouponRow, coupons as couponsTable, db } from "@/db";

function rowToCoupon(row: CouponRow): Coupon {
  return {
    code: row.code,
    type: row.type,
    value: row.value,
    minSubtotal: row.minSubtotal,
    appliesTo: row.appliesTo,
    active: row.active,
    expiresAt: row.expiresAt,
    usageLimit: row.usageLimit,
    usedCount: row.usedCount,
  };
}

/** All coupons the checkout should honor: static fallback + DB (DB wins on code). */
export async function loadCoupons(): Promise<Coupon[]> {
  let dbCoupons: Coupon[] = [];
  try {
    const rows = await db.select().from(couponsTable);
    dbCoupons = rows.map(rowToCoupon);
  } catch {
    // If the table doesn't exist yet or the DB is unreachable, fall back to static.
    dbCoupons = [];
  }
  const byCode = new Map<string, Coupon>();
  for (const c of COUPONS) byCode.set(c.code.toUpperCase(), c);
  for (const c of dbCoupons) byCode.set(c.code.toUpperCase(), c);
  return [...byCode.values()];
}

/** Validate a code against the merged coupon list (async, DB-aware). */
export async function evaluateCouponServer(
  code: string,
  lines: CartLineForCoupon[],
): Promise<CouponResult> {
  const all = await loadCoupons();
  return evaluateCoupon(code, lines, all);
}

/** Increment redemption count for a DB coupon (best-effort; static codes are no-ops). */
export async function incrementCouponUsage(code: string): Promise<void> {
  const normalized = code.trim();
  try {
    const [row] = await db
      .select()
      .from(couponsTable)
      .where(eq(couponsTable.code, normalized))
      .limit(1);
    if (!row) return;
    await db
      .update(couponsTable)
      .set({ usedCount: row.usedCount + 1, updatedAt: new Date() })
      .where(eq(couponsTable.id, row.id));
  } catch {
    // ignore — usage tracking is non-critical
  }
}
