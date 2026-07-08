import { z } from "zod";
import { evaluateCouponServer } from "@/lib/coupons";
import { allowRequest, couponLimiter } from "@/lib/ratelimit";

// Validate a coupon against the cart's lines so the cart can preview the
// discount for admin-managed (DB) codes as well as static ones. The checkout
// route re-validates authoritatively — this endpoint is preview-only.

const schema = z.object({
  code: z.string().min(1).max(64),
  lines: z
    .array(
      z.object({
        type: z.enum(["booking", "sponsorship"]),
        amount: z.coerce.number().int().min(0),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  if (!(await allowRequest(couponLimiter, request))) {
    return Response.json({ valid: false, reason: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ valid: false, reason: "bad_request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ valid: false, reason: "bad_request" }, { status: 400 });
  }

  const result = await evaluateCouponServer(parsed.data.code, parsed.data.lines);
  return Response.json(result);
}
