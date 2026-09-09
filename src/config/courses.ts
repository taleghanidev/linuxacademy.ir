// Static course catalog. Facts that must not drift between the Persian and
// English copies (dates, price, capacity, counts) live here and are imported by
// both language files, the JSON-LD builders and the course pages.
// Courses are sold at a single flat price. Amounts are in Toman, matching
// config/products.ts.

export type Course = {
  slug: string;
  /** Total teaching hours across the whole cohort. */
  hours: number;
  /** Number of live sessions. */
  sessions: number;
  /** Length of one live session, in hours. */
  sessionHours: number;
  /** Day of week the workshop runs. */
  weekday: "friday";
  /** Local start/end time, 24h, in the timezone below. */
  startTime: string;
  endTime: string;
  timeZone: string;
  modules: number;
  lessons: number;
  /** Seats in one cohort. Small by design. */
  seats: number;
  /** Flat course fee, in Toman. One price, no tiers. */
  price: number;
  language: "fa";
  level: "beginner-to-intermediate";
};

export const AI_AGENT_COURSE: Course = {
  slug: "ai-agent-course",
  hours: 16,
  sessions: 8,
  sessionHours: 2,
  weekday: "friday",
  startTime: "12:00",
  endTime: "14:00",
  timeZone: "Asia/Tehran",
  modules: 12,
  lessons: 104,
  seats: 12,
  price: 4_500_000,
  language: "fa",
  level: "beginner-to-intermediate",
};

export const COURSES: Course[] = [AI_AGENT_COURSE];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
