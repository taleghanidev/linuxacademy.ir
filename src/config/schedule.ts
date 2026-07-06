// Consultation scheduling config (formerly the Strapi "available-hours" table).
// All times below are in OWNER_TIMEZONE. Edit freely.

export const OWNER_TIMEZONE = "Australia/Sydney";

// Session length in minutes (1 purchased hour = 1 session).
export const SLOT_MINUTES = 60;

// How far ahead customers can book, and minimum notice before a slot.
export const BOOKING_HORIZON_DAYS = 30;
export const MIN_NOTICE_HOURS = 12;

// Weekly availability, in owner-timezone 24h "HH:mm" ranges.
// Days without an entry are unavailable. (Iranian work week: Sat–Thu.)
export const WEEKLY_HOURS: Record<string, Array<{ from: string; to: string }>> = {
  saturday: [{ from: "10:00", to: "19:00" }],
  sunday: [{ from: "10:00", to: "19:00" }],
  monday: [{ from: "10:00", to: "19:00" }],
  tuesday: [{ from: "10:00", to: "19:00" }],
  wednesday: [{ from: "10:00", to: "19:00" }],
  thursday: [{ from: "10:00", to: "14:00" }],
  // friday: off
};

// Google Calendar event texts.
export const EVENT_SUMMARY = "LinuxAcademy.ir Consult Meeting";
export const EVENT_DESCRIPTION = "This meeting was scheduled via LinuxAcademy.ir";
