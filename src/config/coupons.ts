// Static discount coupons. Validated on the client (preview) and re-validated
// on the server at checkout (enforcement — never trust the client's total).

export type Coupon = {
  code: string;
  type: "percentage" | "fixed"; // percentage of subtotal, or fixed Toman amount
  value: number;
  minSubtotal?: number; // minimum order subtotal (Toman) to qualify
  appliesTo?: "all" | "booking" | "sponsorship";
  active?: boolean;
};

export const COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percentage", value: 10, appliesTo: "all", active: true },
  {
    code: "CONSULT50K",
    type: "fixed",
    value: 50_000,
    minSubtotal: 5_000_000,
    appliesTo: "booking",
    active: true,
  },
];

export type CartLineForCoupon = { type: "booking" | "sponsorship"; amount: number };

export type CouponResult =
  | { valid: true; code: string; discount: number }
  | { valid: false; reason: string };

// Compute the discount for a coupon code against the given lines.
// Returns a clamped, integer Toman discount. Shared by client + server.
export function evaluateCoupon(codeRaw: string, lines: CartLineForCoupon[]): CouponResult {
  const code = codeRaw.trim().toUpperCase();
  if (!code) return { valid: false, reason: "empty" };

  const coupon = COUPONS.find((c) => c.code.toUpperCase() === code && c.active !== false);
  if (!coupon) return { valid: false, reason: "not_found" };

  const scope = coupon.appliesTo ?? "all";
  const eligible = lines.filter((l) => scope === "all" || l.type === scope);
  const eligibleSubtotal = eligible.reduce((s, l) => s + l.amount, 0);
  if (eligibleSubtotal <= 0) return { valid: false, reason: "not_applicable" };

  if (coupon.minSubtotal && eligibleSubtotal < coupon.minSubtotal) {
    return { valid: false, reason: "min_subtotal" };
  }

  const raw =
    coupon.type === "percentage"
      ? Math.round((eligibleSubtotal * coupon.value) / 100)
      : coupon.value;

  const discount = Math.max(0, Math.min(raw, eligibleSubtotal));
  return { valid: true, code: coupon.code, discount };
}
