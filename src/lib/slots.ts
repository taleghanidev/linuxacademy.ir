// Server-side slot generation: weekly working hours (owner timezone) minus
// Google Calendar busy blocks → bookable UTC slot instants.

import { DateTime, Interval } from "luxon";
import { SLOT_MINUTES } from "@/config/schedule";
import type { BusyBlock } from "@/lib/google-calendar";
import type { ScheduleSettings } from "@/lib/schedule-settings";

const WEEKDAY_NAMES = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export function bookingWindow(s: ScheduleSettings): { fromIso: string; toIso: string } {
  const now = DateTime.utc();
  return {
    fromIso: now.toISO() as string,
    toIso: now.plus({ days: s.bookingHorizonDays }).toISO() as string,
  };
}

// All candidate slot starts (UTC ISO) inside the booking window.
export function candidateSlots(s: ScheduleSettings): DateTime[] {
  const slots: DateTime[] = [];
  const earliest = DateTime.utc().plus({ hours: s.minNoticeHours });
  const horizon = DateTime.utc().plus({ days: s.bookingHorizonDays });

  let day = DateTime.now().setZone(s.timezone).startOf("day");
  while (day < horizon.setZone(s.timezone)) {
    const ranges = s.weeklyHours[WEEKDAY_NAMES[day.weekday - 1]] ?? [];
    for (const range of ranges) {
      const [fh, fm] = range.from.split(":").map(Number);
      const [th, tm] = range.to.split(":").map(Number);
      let start = day.set({ hour: fh, minute: fm });
      const end = day.set({ hour: th, minute: tm });
      while (start.plus({ minutes: SLOT_MINUTES }) <= end) {
        const utc = start.toUTC();
        if (utc > earliest && utc < horizon) slots.push(utc);
        start = start.plus({ minutes: SLOT_MINUTES });
      }
    }
    day = day.plus({ days: 1 });
  }
  return slots;
}

// Remove candidates that overlap a busy block.
export function filterFree(slots: DateTime[], busy: BusyBlock[]): DateTime[] {
  const busyIntervals = busy
    .map((b) =>
      Interval.fromDateTimes(DateTime.fromISO(b.start).toUTC(), DateTime.fromISO(b.end).toUTC()),
    )
    .filter((i) => i.isValid);
  return slots.filter((s) => {
    const slot = Interval.after(s, { minutes: SLOT_MINUTES });
    return !busyIntervals.some((b) => b.overlaps(slot));
  });
}

// True if the given UTC instant is one of the currently-free slots.
export function isSlotFree(slotStartIso: string, freeSlots: DateTime[]): boolean {
  const target = DateTime.fromISO(slotStartIso).toUTC().toMillis();
  return freeSlots.some((s) => s.toMillis() === target);
}
