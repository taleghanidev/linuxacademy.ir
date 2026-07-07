import { desc, eq } from "drizzle-orm";
import { coupons, customers, db, orderItems, orders } from "@/db";

// One row per order line, joined with its order (payment) and customer.
function itemsByType(type: "booking" | "sponsorship") {
  return db
    .select({
      id: orderItems.id,
      label: orderItems.label,
      itemKey: orderItems.itemKey,
      quantity: orderItems.quantity,
      amount: orderItems.amount,
      meta: orderItems.meta,
      orderId: orders.id,
      status: orders.status,
      refId: orders.refId,
      couponCode: orders.couponCode,
      createdAt: orders.createdAt,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orderItems.type, type))
    .orderBy(desc(orders.createdAt));
}

export function getBookings() {
  return itemsByType("booking");
}

export function getSponsorships() {
  return itemsByType("sponsorship");
}

// All orders (for revenue + counts).
export function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

// Orders joined with customer + their line items (for the orders table).
export async function getOrdersDetailed() {
  const orderRows = await db
    .select({
      id: orders.id,
      subtotal: orders.subtotal,
      discount: orders.discount,
      total: orders.total,
      couponCode: orders.couponCode,
      status: orders.status,
      refId: orders.refId,
      createdAt: orders.createdAt,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt));

  const items = await db
    .select({
      orderId: orderItems.orderId,
      label: orderItems.label,
      quantity: orderItems.quantity,
      type: orderItems.type,
    })
    .from(orderItems);

  const byOrder = new Map<string, string[]>();
  for (const i of items) {
    byOrder.set(i.orderId, [...(byOrder.get(i.orderId) ?? []), `${i.label} ×${i.quantity}`]);
  }
  return orderRows.map((o) => ({ ...o, itemsSummary: (byOrder.get(o.id) ?? []).join(" · ") }));
}

// Customers with aggregated order count + total paid (Toman).
export async function getCustomers() {
  const custRows = await db.select().from(customers).orderBy(desc(customers.createdAt));
  const orderRows = await db
    .select({ customerId: orders.customerId, total: orders.total, status: orders.status })
    .from(orders);

  const agg = new Map<string, { count: number; spent: number }>();
  for (const o of orderRows) {
    const a = agg.get(o.customerId) ?? { count: 0, spent: 0 };
    a.count += 1;
    if (o.status === "PAID") a.spent += o.total;
    agg.set(o.customerId, a);
  }

  return custRows.map((c) => ({
    ...c,
    orderCount: agg.get(c.id)?.count ?? 0,
    spent: agg.get(c.id)?.spent ?? 0,
  }));
}

// All admin-managed discount codes, newest first.
export function getCouponsList() {
  return db.select().from(coupons).orderBy(desc(coupons.createdAt));
}
