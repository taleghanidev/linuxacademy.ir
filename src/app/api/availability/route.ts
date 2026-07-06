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
    const message = err instanceof Error ? err.message : "Availability lookup failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
