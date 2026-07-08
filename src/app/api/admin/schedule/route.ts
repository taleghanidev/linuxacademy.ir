import { isAdmin } from "@/lib/admin";
import { invalidateBusyCache } from "@/lib/availability";
import {
  getScheduleSettings,
  saveScheduleSettings,
  scheduleSettingsSchema,
} from "@/lib/schedule-settings";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "forbidden" }, { status: 403 });
  return Response.json({ settings: await getScheduleSettings() });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = scheduleSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  }

  await saveScheduleSettings(parsed.data);
  // Busy cache spans the booking horizon — refresh it so a wider/narrower
  // window takes effect immediately.
  await invalidateBusyCache();
  return Response.json({ ok: true, settings: parsed.data });
}
