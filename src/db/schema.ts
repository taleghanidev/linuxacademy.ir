// Linux Academy — store schema (Drizzle + Postgres/Neon).
// A cart checkout creates one `order` (the payment) with many `order_items`
// (consulting bookings and/or ad sponsorships). Everything else is static.

import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const paymentStatus = pgEnum("payment_status", ["PENDING", "PAID", "FAILED", "CANCELED"]);
export const itemType = pgEnum("item_type", ["booking", "sponsorship"]);
export const couponType = pgEnum("coupon_type", ["percentage", "fixed"]);
export const couponScope = pgEnum("coupon_scope", ["all", "booking", "sponsorship"]);

// A buyer's contact details, captured at checkout (guest-friendly, keyed by email).
export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// One order = one Zarinpal payment covering every item in the cart.
export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),

    // Amounts in Toman.
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull().default(0),
    total: integer("total").notNull(),
    couponCode: text("coupon_code"),

    // Payment (Zarinpal)
    status: paymentStatus("status").notNull().default("PENDING"),
    authority: text("authority").unique(),
    refId: text("ref_id"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_status_idx").on(t.status), index("orders_created_idx").on(t.createdAt)],
);

// A single line in an order: either a consulting booking or a sponsorship.
// `meta` holds type-specific fields (note, company info, slot times, gcal id).
export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    type: itemType("type").notNull(),
    itemKey: text("item_key").notNull(), // packageKey or tierKey (static config)
    label: text("label").notNull(),

    // quantity = hours (booking) or number of placements (sponsorship)
    unitPrice: integer("unit_price").notNull(), // Toman
    quantity: integer("quantity").notNull().default(1),
    amount: integer("amount").notNull(), // unitPrice * quantity, Toman

    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId), index("order_items_type_idx").on(t.type)],
);

// Admin-managed discount codes. The static config codes (src/config/coupons.ts)
// stay as a built-in fallback; these are created/edited from the dashboard.
export const coupons = pgTable(
  "coupons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    code: text("code").notNull().unique(),
    type: couponType("type").notNull(),
    // percentage: 1–100; fixed: Toman amount.
    value: integer("value").notNull(),
    minSubtotal: integer("min_subtotal").notNull().default(0),
    appliesTo: couponScope("applies_to").notNull().default("all"),
    active: boolean("active").notNull().default(true),
    // null = never expires / unlimited.
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("coupons_active_idx").on(t.active)],
);

export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type CouponRow = typeof coupons.$inferSelect;
