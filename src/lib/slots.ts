// Server-side slot generation: weekly working hours (owner timezone) minus
// Google Calendar busy blocks → bookable UTC slot instants.

import { DateTime, Interval } from "luxon";
import {
  BOOKING_HORIZON_DAYS,
  MIN_NOTICE_HOURS,
  OWNER_TIMEZONE,
  SLOT_MINUTES,
  WEEKLY_HOURS,
} from "@/config/schedule";
import type { BusyBlock } from "@/lib/google-calendar";

const WEEKDAY_NAMES = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function bookingWindow(): { fromIso: string; toIso: string } {
  const now = DateTime.utc();
  return {
    fromIso: now.toISO() as string,
    toIso: now.plus({ days: BOOKING_HORIZON_DAYS }).toISO() as string,
  };
}

// All candidate slot starts (UTC ISO) inside the booking window.
export function candidateSlots(): DateTime[] {
  const slots: DateTime[] = [];
  const earliest = DateTime.utc().plus({ hours: MIN_NOTICE_HOURS });
  const horizon = DateTime.utc().plus({ days: BOOKING_HORIZON_DAYS });

  let day = DateTime.now().setZone(OWNER_TIMEZONE).startOf("day");
  while (day < horizon.setZone(OWNER_TIMEZONE)) {
    const ranges = WEEKLY_HOURS[WEEKDAY_NAMES[day.weekday - 1]] ?? [];
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
