import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { siteUrl } from "@/lib/checkout";
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
    return Response.redirect(`${base}/order/thank-you?ref=${order.refId ?? ""}`, 302);
  }

  if (status !== "OK") {
    await db
      .update(orders)
      .set({ status: "CANCELED", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return Response.redirect(`${base}/payment-error?reason=canceled`, 302);
  }

  const result = await zarinpalVerify({ amount: order.total, authority });
  if (!result.success) {
    await db
      .update(orders)
      .set({ status: "FAILED", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return Response.redirect(`${base}/payment-error?reason=verify-failed&code=${result.code}`, 302);
  }

  await db
    .update(orders)
    .set({ status: "PAID", refId: result.refId, updatedAt: new Date() })
    .where(eq(orders.id, order.id));

  return Response.redirect(`${base}/order/thank-you?ref=${result.refId ?? ""}`, 302);
}
