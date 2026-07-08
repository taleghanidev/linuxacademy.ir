import { eq } from "drizzle-orm";
import { z } from "zod";
import { getPackage, getTier } from "@/config/products";
import { db, orderItems, orders } from "@/db";
import { siteUrl, upsertCustomer } from "@/lib/checkout";
import { evaluateCouponServer } from "@/lib/coupons";
import { allowRequest, checkoutLimiter } from "@/lib/ratelimit";
import { zarinpalRequest } from "@/lib/zarinpal";

const itemSchema = z.object({
  type: z.enum(["booking", "sponsorship"]),
  itemKey: z.string().min(1),
  label: z.string().min(1).max(200),
  quantity: z.coerce.number().int().min(1).max(100),
  meta: z.record(z.string(), z.unknown()).optional(),
});

const schema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(3),
  }),
  items: z.array(itemSchema).min(1),
  couponCode: z.string().max(40).optional(),
});

type PricedLine = {
  type: "booking" | "sponsorship";
  itemKey: string;
  label: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  meta: Record<string, unknown>;
};

// Recompute every line's price from static config — never trust client amounts.
function priceLine(item: z.infer<typeof itemSchema>): PricedLine | { error: string } {
  if (item.type === "booking") {
    const pkg = getPackage(item.itemKey);
    if (!pkg) return { error: `Unknown package: ${item.itemKey}` };
    if (item.quantity < pkg.minHours || item.quantity > pkg.maxHours) {
      return { error: `Hours for ${pkg.key} must be ${pkg.minHours}–${pkg.maxHours}` };
    }
    return {
      type: "booking",
      itemKey: pkg.key,
      label: item.label,
      unitPrice: pkg.hourlyRate,
      quantity: item.quantity,
      amount: pkg.hourlyRate * item.quantity,
      meta: item.meta ?? {},
    };
  }
  const tier = getTier(item.itemKey);
  if (!tier) return { error: `Unknown tier: ${item.itemKey}` };
  return {
    type: "sponsorship",
    itemKey: tier.key,
    label: item.label,
    unitPrice: tier.price,
    quantity: item.quantity,
    amount: tier.price * item.quantity,
    meta: item.meta ?? {},
  };
}

export async function POST(request: Request) {
  if (!(await allowRequest(checkoutLimiter, request))) {
    return Response.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { customer, items, couponCode } = parsed.data;

  const priced: PricedLine[] = [];
  for (const item of items) {
    const line = priceLine(item);
    if ("error" in line) return Response.json({ error: line.error }, { status: 400 });
    priced.push(line);
  }

  const subtotal = priced.reduce((s, l) => s + l.amount, 0);

  let discount = 0;
  let appliedCoupon: string | null = null;
  if (couponCode?.trim()) {
    const result = await evaluateCouponServer(
      couponCode,
      priced.map((l) => ({ type: l.type, amount: l.amount })),
    );
    if (!result.valid) {
      return Response.json({ error: "Invalid coupon", reason: result.reason }, { status: 400 });
    }
    discount = result.discount;
    appliedCoupon = result.code;
  }

  const total = Math.max(0, subtotal - discount);
  if (total <= 0) {
    return Response.json({ error: "Order total must be greater than zero" }, { status: 400 });
  }

  const customerId = await upsertCustomer(customer);

  const [order] = await db
    .insert(orders)
    .values({ customerId, subtotal, discount, total, couponCode: appliedCoupon, status: "PENDING" })
    .returning();

  await db.insert(orderItems).values(
    priced.map((l) => ({
      orderId: order.id,
      type: l.type,
      itemKey: l.itemKey,
      label: l.label,
      unitPrice: l.unitPrice,
      quantity: l.quantity,
      amount: l.amount,
      meta: l.meta,
    })),
  );

  // Test mode: PAYMENT_MODE=mock skips the gateway entirely — the buyer is sent
  // straight to our verify endpoint, which settles the order with a MOCK ref.
  // Lets the whole purchase flow be exercised before Zarinpal credentials exist.
  if (process.env.PAYMENT_MODE === "mock") {
    const authority = `MOCK-${order.id}`;
    await db
      .update(orders)
      .set({ authority, updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return Response.json({
      startPayUrl: `${siteUrl()}/api/checkout/verify?Authority=${authority}&Status=OK`,
    });
  }

  try {
    const { authority, startPayUrl } = await zarinpalRequest({
      amount: total,
      callbackUrl: `${siteUrl()}/api/checkout/verify`,
      description: `Linux Academy order (${priced.length} item${priced.length > 1 ? "s" : ""})`,
      metadata: { order_id: order.id, email: customer.email },
    });

    await db
      .update(orders)
      .set({ authority, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    return Response.json({ startPayUrl });
  } catch (err) {
    await db
      .update(orders)
      .set({ status: "FAILED", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    // Log details server-side; never leak gateway/internal messages to buyers.
    console.error("payment init failed:", err);
    return Response.json({ error: "Payment init failed" }, { status: 502 });
  }
}
