import { getFreeSlotIsos } from "@/lib/availability";
import { isCalendarConfigured } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isCalendarConfigured()) {
    return Response.json({ error: "Calendar not configured" }, { status: 503 });
  }
  try {
    const slots = await getFreeSlotIsos();
    return Response.json({ slots });
  } catch (err) {
    // Log the detail server-side; never leak internals to the client.
    console.error("availability lookup failed:", err);
    return Response.json({ error: "Availability lookup failed" }, { status: 502 });
  }
}
