import { eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { z } from "zod";
import { EVENT_DESCRIPTION, EVENT_SUMMARY, SLOT_MINUTES } from "@/config/schedule";
import { customers, db, orderItems, orders } from "@/db";
import { getFreeSlotIsos, invalidateBusyCache } from "@/lib/availability";
import { notifySessionScheduled } from "@/lib/email";
import { createEvent, isCalendarConfigured } from "@/lib/google-calendar";
import { allowRequest, scheduleLimiter } from "@/lib/ratelimit";
import { isSlotFree } from "@/lib/slots";

export const dynamic = "force-dynamic";

type Session = { start: string; end: string; eventId: string; meetLink: string | null };

async function loadOrder(orderId: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, order.customerId))
    .limit(1);
  return { order, items, customer };
}

function sessionStats(items: (typeof orderItems.$inferSelect)[]) {
  const bookingItems = items.filter((i) => i.type === "booking");
  const total = bookingItems.reduce((s, i) => s + i.quantity, 0);
  const sessions = bookingItems.flatMap(
    (i) => ((i.meta as Record<string, unknown>)?.sessions as Session[] | undefined) ?? [],
  );
  return { bookingItems, total, scheduled: sessions.length, sessions };
}

// GET /api/schedule?order=<id> → scheduling status for a paid order.
export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("order");
  if (!orderId) return Response.json({ error: "Missing order" }, { status: 400 });

  const loaded = await loadOrder(orderId);
  if (!loaded) return Response.json({ error: "Order not found" }, { status: 404 });

  const { order, items } = loaded;
  const { total, scheduled, sessions } = sessionStats(items);
  return Response.json({
    paid: order.status === "PAID",
    totalSessions: total,
    scheduled,
    left: order.status === "PAID" ? Math.max(0, total - scheduled) : 0,
    sessions,
  });
}

const bookSchema = z.object({
  orderId: z.string().min(1),
  slotStart: z.string().datetime({ offset: true }),
  guests: z.array(z.string().email()).max(10).optional(),
});

// POST /api/schedule → book one session into the owner's Google Calendar.
export async function POST(request: Request) {
  if (!(await allowRequest(scheduleLimiter, request))) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }
  if (!isCalendarConfigured()) {
    return Response.json({ error: "Calendar not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed" }, { status: 400 });
  }
  const { orderId, slotStart, guests } = parsed.data;

  const loaded = await loadOrder(orderId);
  if (!loaded) return Response.json({ error: "Order not found" }, { status: 404 });
  const { order, items, customer } = loaded;

  if (order.status !== "PAID") {
    return Response.json({ error: "Order is not paid" }, { status: 403 });
  }
  const { bookingItems, total, scheduled } = sessionStats(items);
  if (scheduled >= total) {
    return Response.json({ error: "No sessions left" }, { status: 409 });
  }

  // Re-check the slot against fresh availability (skip cache to avoid races).
  let free: string[];
  try {
    free = await getFreeSlotIsos(true);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Availability lookup failed";
    return Response.json({ error: message }, { status: 502 });
  }
  const freeDts = free.map((s) => DateTime.fromISO(s));
  if (!isSlotFree(slotStart, freeDts)) {
    return Response.json({ error: "Slot no longer available" }, { status: 409 });
  }

  const startIso = DateTime.fromISO(slotStart).toUTC().toISO() as string;
  const endIso = DateTime.fromISO(slotStart)
    .toUTC()
    .plus({ minutes: SLOT_MINUTES })
    .toISO() as string;

  const note = bookingItems
    .map((i) => (i.meta as Record<string, unknown>)?.note)
    .filter(Boolean)
    .join(" | ");

  let event: Awaited<ReturnType<typeof createEvent>>;
  try {
    event = await createEvent({
      summary: EVENT_SUMMARY,
      description: note ? `${EVENT_DESCRIPTION}\n\nNote: ${note}` : EVENT_DESCRIPTION,
      startIso,
      endIso,
      attendees: [customer.email, ...(guests ?? [])],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Event creation failed";
    return Response.json({ error: message }, { status: 502 });
  }

  // Record the session on the first booking item with remaining capacity.
  const target = bookingItems.find((i) => {
    const s = (((i.meta as Record<string, unknown>)?.sessions as Session[] | undefined) ?? [])
      .length;
    return s < i.quantity;
  });
  if (target) {
    const meta = (target.meta as Record<string, unknown>) ?? {};
    const sessions = ((meta.sessions as Session[] | undefined) ?? []).concat({
      start: startIso,
      end: endIso,
      eventId: event.id,
      meetLink: event.meetLink,
    });
    await db
      .update(orderItems)
      .set({ meta: { ...meta, sessions } })
      .where(eq(orderItems.id, target.id));
  }

  await invalidateBusyCache();

  // Owner notification (non-blocking semantics: errors are swallowed inside).
  await notifySessionScheduled({
    customer: { name: customer.name, email: customer.email },
    startIso,
    meetLink: event.meetLink,
  });

  return Response.json({
    ok: true,
    session: { start: startIso, end: endIso, meetLink: event.meetLink },
    left: Math.max(0, total - scheduled - 1),
  });
}
