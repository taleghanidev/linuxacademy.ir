import { eq } from "drizzle-orm";
import { customers, db, orderItems, orders } from "@/db";
import { siteUrl } from "@/lib/checkout";
import { incrementCouponUsage } from "@/lib/coupons";
import { notifyOrderPaid } from "@/lib/email";
import { zarinpalVerify } from "@/lib/zarinpal";

// Zarinpal redirects the buyer back here with ?Authority=...&Status=OK|NOK
export async function GET(request: Request) {
  const url = new URL(request.url);
  const authority = url.searchParams.get("Authority");
  const status = url.searchParams.get("Status");
  const base = siteUrl();

  if (!authority) {
    return Response.redirect(`${base}/payment-error?reason=missing-authority`, 302);
  }

  const [order] = await db.select().from(orders).where(eq(orders.authority, authority)).limit(1);
  if (!order) {
    return Response.redirect(`${base}/payment-error?reason=not-found`, 302);
  }

  // Already settled — don't double-process.
  if (order.status === "PAID") {
    return Response.redirect(
      `${base}/order/thank-you?ref=${order.refId ?? ""}&order=${order.id}`,
      302,
    );
  }

  if (status !== "OK") {
    await db
      .update(orders)
      .set({ status: "CANCELED", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return Response.redirect(`${base}/payment-error?reason=canceled`, 302);
  }

  // Mock authorities settle without the gateway — but ONLY when mock mode is
  // explicitly enabled, so stray MOCK links can't mark real orders paid.
  const isMock = authority.startsWith("MOCK-");
  let refId: string | null;
  if (isMock) {
    if (process.env.PAYMENT_MODE !== "mock") {
      return Response.redirect(`${base}/payment-error?reason=verify-failed&code=mock-off`, 302);
    }
    refId = `MOCK-${order.id.slice(0, 8).toUpperCase()}`;
  } else {
    const result = await zarinpalVerify({ amount: order.total, authority });
    if (!result.success) {
      await db
        .update(orders)
        .set({ status: "FAILED", updatedAt: new Date() })
        .where(eq(orders.id, order.id));
      return Response.redirect(
        `${base}/payment-error?reason=verify-failed&code=${result.code}`,
        302,
      );
    }
    refId = result.refId;
  }

  await db
    .update(orders)
    .set({ status: "PAID", refId, updatedAt: new Date() })
    .where(eq(orders.id, order.id));

  // Count the redemption so coupon usage limits are actually enforced.
  if (order.couponCode) await incrementCouponUsage(order.couponCode);

  // Owner notification email (never blocks the customer's redirect).
  try {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, order.customerId))
      .limit(1);
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    await notifyOrderPaid({
      refId,
      total: order.total,
      discount: order.discount,
      couponCode: order.couponCode,
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      items: items.map((i) => ({
        label: i.label,
        quantity: i.quantity,
        amount: i.amount,
        type: i.type,
      })),
    });
  } catch (err) {
    console.error("Order notification failed:", err);
  }

  return Response.redirect(`${base}/order/thank-you?ref=${refId ?? ""}&order=${order.id}`, 302);
}
