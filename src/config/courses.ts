// Static course catalog. Facts that must not drift between the Persian and
// English copies (dates, price, capacity, counts) live here and are imported by
// both language files, the JSON-LD builders and the course pages.
// Courses are sold at one flat price, in two currencies: Toman for students
// inside Iran (paid to the Iranian account) and Australian dollars for students
// outside it (paid to the international account). Both are defined here so the
// page, the form and the API can never disagree about what someone owes.

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
  /** First session, ISO date. Every other session is a week later. */
  startDate: string;
  /** Local start/end time, 24h, in the timezone below. */
  startTime: string;
  endTime: string;
  timeZone: string;
  modules: number;
  lessons: number;
  /** Seats in one cohort. Small by design. */
  seats: number;
  /** Fee for students inside Iran, in Toman. */
  price: number;
  /** Fee for students outside Iran, in Australian dollars. */
  priceAud: number;
  language: "fa";
  level: "beginner-to-intermediate";
};

export const AI_AGENT_COURSE: Course = {
  slug: "ai-agent-course",
  hours: 16,
  sessions: 8,
  sessionHours: 2,
  weekday: "friday",
  startDate: "2026-11-06",
  startTime: "12:00",
  endTime: "14:00",
  timeZone: "Asia/Tehran",
  modules: 12,
  lessons: 104,
  seats: 12,
  price: 4_900_000,
  priceAud: 100,
  language: "fa",
  level: "beginner-to-intermediate",
};

export const COURSES: Course[] = [AI_AGENT_COURSE];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/**
 * Where students send the course fee. Registration is a bank transfer plus a
 * photo of the receipt, so these values are shown verbatim on the page and
 * people will type them into a banking app.
 *
 * TODO: replace every value below with the real account before announcing the
 * course. They are placeholders, not a live account.
 */
export type PayRegion = "iran" | "international";

export const BANK_TRANSFER = {
  bankName: "بانک ملت",
  accountHolder: "امیرمهدی طالقانی",
  /** 16-digit card number, the usual way to transfer in Iran. */
  cardNumber: "0000-0000-0000-0000",
  /** IR + 24 digits. */
  iban: "IR000000000000000000000000",
  accountNumber: "0000000000",
} as const;

/**
 * How students outside Iran pay. Wise and Revolut are the easy routes: each is
 * just a link, and the page renders a QR code from it, so nothing here is an
 * image that can go stale. Leave a link empty and that option is hidden.
 *
 * Both links are live. Clearing either one hides that option on the page.
 */
export const INTERNATIONAL_PAYMENT = {
  /** Wisetag: permanent and reusable, so it survives every cohort. */
  wise: "https://wise.com/pay/me/seyedamirmehdit",
  /** revolut.me RevTag link: permanent and reusable, same as the Wisetag. */
  revolut: "https://revolut.me/matttaleg",
} as const;

/**
 * Bank details for students outside Iran, for anyone who would rather do a
 * plain transfer than use Wise or Revolut. Same warning as above: these are
 * placeholders. Replace them with the real Australian account before taking
 * any international registration.
 */
export const BANK_TRANSFER_INTL = {
  bankName: "TODO Bank",
  accountHolder: "TODO Account Holder",
  /** Australian BSB, 6 digits. */
  bsb: "000-000",
  accountNumber: "00000000",
  /** For transfers from outside Australia. */
  swift: "TODOAU0S",
} as const;

/** Every session date for a course, derived from its start date. */
export function sessionDates(course: Course): string[] {
  const out: string[] = [];
  const first = new Date(`${course.startDate}T00:00:00Z`);
  for (let i = 0; i < course.sessions; i++) {
    const d = new Date(first);
    d.setUTCDate(d.getUTCDate() + 7 * i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/** ISO date of the final session. */
export function lastSessionDate(course: Course): string {
  const all = sessionDates(course);
  return all[all.length - 1];
}
