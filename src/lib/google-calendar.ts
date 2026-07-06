// Google Calendar integration: free/busy lookups + event creation.
// Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN.

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN as string,
      grant_type: "refresh_token",
    }),
  });
  const json = await res.json();
  if (!json.access_token) {
    throw new Error(`Google token refresh failed: ${json.error ?? "unknown"}`);
  }
  return json.access_token as string;
}

export type BusyBlock = { start: string; end: string };

// Busy intervals on the owner's calendar between two ISO instants.
export async function getBusyBlocks(timeMinIso: string, timeMaxIso: string): Promise<BusyBlock[]> {
  const token = await getAccessToken();
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      items: [{ id: CALENDAR_ID }],
    }),
  });
  const json = await res.json();
  const cal = json.calendars?.[CALENDAR_ID];
  if (!cal) throw new Error(`freeBusy failed: ${JSON.stringify(json.error ?? json).slice(0, 200)}`);
  return (cal.busy ?? []) as BusyBlock[];
}

export type CreatedEvent = { id: string; meetLink: string | null; htmlLink: string | null };

// Create a calendar event with attendees; Google emails the invites.
export async function createEvent(params: {
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  attendees: string[]; // emails
}): Promise<CreatedEvent> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID,
    )}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: params.summary,
        description: params.description,
        start: { dateTime: params.startIso },
        end: { dateTime: params.endIso },
        attendees: params.attendees.map((email) => ({ email })),
        visibility: "private",
        conferenceData: {
          createRequest: {
            requestId: `la-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
    },
  );
  const json = await res.json();
  if (!res.ok || !json.id) {
    throw new Error(`Event creation failed: ${JSON.stringify(json.error ?? json).slice(0, 200)}`);
  }
  const meetLink =
    json.hangoutLink ||
    json.conferenceData?.entryPoints?.find(
      (e: { entryPointType?: string }) => e.entryPointType === "video",
    )?.uri ||
    null;
  return { id: json.id as string, meetLink, htmlLink: json.htmlLink ?? null };
}
