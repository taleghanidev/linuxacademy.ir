// Admin-editable schedule settings, stored in the `settings` table under the
// "schedule" key. The static config (src/config/schedule.ts) is the fallback
// and the shape contract; DB values override it when present.

import { eq } from "drizzle-orm";
import { z } from "zod";
import { BOOKING_HORIZON_DAYS, MIN_NOTICE_HOURS, WEEKLY_HOURS } from "@/config/schedule";
import { db, settings } from "@/db";

const SETTINGS_KEY = "schedule";

const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;

const rangeSchema = z
  .object({ from: z.string().regex(timeRe), to: z.string().regex(timeRe) })
  .refine((r) => r.from < r.to, { message: "from must be before to" });

export const scheduleSettingsSchema = z.object({
  // partialRecord: days may be omitted (omitted = closed). Plain z.record with
  // an enum key is exhaustive in Zod v4 and would reject partial weeks.
  weeklyHours: z.partialRecord(
    z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
    z.array(rangeSchema).max(4),
  ),
  minNoticeHours: z.coerce.number().int().min(0).max(168),
  bookingHorizonDays: z.coerce.number().int().min(1).max(90),
});

export type ScheduleSettings = z.infer<typeof scheduleSettingsSchema>;

export function defaultScheduleSettings(): ScheduleSettings {
  return {
    weeklyHours: WEEKLY_HOURS,
    minNoticeHours: MIN_NOTICE_HOURS,
    bookingHorizonDays: BOOKING_HORIZON_DAYS,
  };
}

/** Effective settings: DB override when valid, otherwise the static defaults. */
export async function getScheduleSettings(): Promise<ScheduleSettings> {
  try {
    const [row] = await db.select().from(settings).where(eq(settings.key, SETTINGS_KEY)).limit(1);
    if (!row) return defaultScheduleSettings();
    const parsed = scheduleSettingsSchema.safeParse(row.value);
    return parsed.success ? parsed.data : defaultScheduleSettings();
  } catch {
    // Table missing / DB down — never break booking over settings.
    return defaultScheduleSettings();
  }
}

export async function saveScheduleSettings(value: ScheduleSettings): Promise<void> {
  await db
    .insert(settings)
    .values({ key: SETTINGS_KEY, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: new Date() },
    });
}
