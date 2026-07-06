"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment-jalaali";
import { DateTime } from "luxon";
import NavBar from "@/components/NavBar";
import navBarEn from "@/language/en/components/navBar";
import navBarFa from "@/language/fa/components/navBar";
import calendarEn from "@/language/en/pages/calendar";
import calendarFa from "@/language/fa/pages/calendar";
import { Link, useLocation } from "@/lib/router";

type Status = {
  paid: boolean;
  totalSessions: number;
  scheduled: number;
  left: number;
  sessions: Array<{ start: string; meetLink: string | null }>;
};

const Schedule = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("order") || "";

  const isFa = document.documentElement.dir === "rtl";
  const t: any = isFa ? calendarFa : calendarEn;
  const navLang = isFa ? navBarFa : navBarEn;

  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [tz, setTz] = useState(browserTz);
  const [useJalali, setUseJalali] = useState(isFa);

  const [status, setStatus] = useState<Status | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null); // yyyy-MM-dd in tz
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // UTC ISO
  const [guests, setGuests] = useState<string[]>([]);
  const [booking, setBooking] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const timezones: string[] = useMemo(() => {
    try {
      return (Intl as any).supportedValuesOf("timeZone");
    } catch {
      return [browserTz, "Asia/Tehran", "UTC", "Europe/Berlin", "America/New_York"];
    }
  }, [browserTz]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Load status and availability independently: a calendar hiccup should not
    // hide the customer's session status.
    try {
      const sRes = await fetch(`/api/schedule?order=${encodeURIComponent(orderId)}`);
      const sJson = await sRes.json();
      if (!sRes.ok) throw new Error(sJson.error || t.couldNotFetchBookingsLeft);
      setStatus(sJson);
    } catch (e: any) {
      setError(e.message || t.couldNotFetchBookingsLeft);
      setLoading(false);
      return;
    }
    try {
      const aRes = await fetch("/api/availability");
      const aJson = await aRes.json();
      if (!aRes.ok) throw new Error(aJson.error || t.couldNotLoadSlots);
      setSlots(aJson.slots || []);
    } catch (e: any) {
      setError(e.message || t.couldNotLoadSlots);
    } finally {
      setLoading(false);
    }
  }, [orderId, t.couldNotLoadSlots, t.couldNotFetchBookingsLeft]);

  useEffect(() => {
    if (orderId) load();
    else {
      setLoading(false);
      setError(t.noBookingsInGroup);
    }
  }, [orderId, load, t.noBookingsInGroup]);

  // Group slot ISOs by calendar date in the selected timezone.
  const byDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const iso of slots) {
      const key = DateTime.fromISO(iso).setZone(tz).toFormat("yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), iso]);
    }
    return map;
  }, [slots, tz]);

  const dates = useMemo(() => [...byDate.keys()].sort(), [byDate]);

  const fmtDate = (ymd: string) => {
    if (useJalali) return moment(ymd, "YYYY-MM-DD").format("dddd jD jMMMM jYYYY");
    return DateTime.fromISO(ymd)
      .setLocale(isFa ? "fa" : "en")
      .toFormat("cccc d LLLL yyyy");
  };
  const fmtTime = (iso: string) => DateTime.fromISO(iso).setZone(tz).toFormat("HH:mm");

  const book = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    setError(null);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          slotStart: selectedSlot,
          guests: guests.map((g) => g.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t.bookingFailed);
      setConfirmation(selectedSlot);
      setSelectedSlot(null);
      setGuests([]);
      await load();
    } catch (e: any) {
      setError(e.message || t.bookingFailed);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={navLang} />
      <div className="container mx-auto max-w-5xl px-4 pt-28 pb-16">
        <h1 className="mb-2 text-3xl font-bold">{t.title}</h1>

        {/* Sessions status */}
        {loading ? (
          <p className="text-gray-500">{t.checkingSessions}</p>
        ) : status ? (
          status.left > 0 ? (
            <p className="mb-6 text-gray-700">
              {t.youHave} <b className="text-brand-purple">{status.left}</b> {t.bookingsLeft}
            </p>
          ) : status.totalSessions > 0 ? (
            <p className="mb-6 font-medium text-green-700">{t.allSessionsBooked}</p>
          ) : (
            <p className="mb-6 text-red-600">{t.noBookingsLeft}</p>
          )
        ) : null}

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {confirmation && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
            {t.bookingConfirmed}{" "}
            {fmtDate(DateTime.fromISO(confirmation).setZone(tz).toFormat("yyyy-MM-dd"))} {t.at}{" "}
            {fmtTime(confirmation)} {t.isConfirmed} ✅
          </div>
        )}

        {/* Scheduled sessions list */}
        {status && status.sessions.length > 0 && (
          <div className="mb-8 rounded-lg border bg-white p-4">
            <div className="mb-2 text-sm font-semibold text-gray-600">
              {isFa ? "جلسات رزروشده" : "Scheduled sessions"}
            </div>
            <ul className="space-y-1 text-sm">
              {status.sessions.map((s) => (
                <li key={s.start} className="flex flex-wrap items-center gap-2">
                  <span>
                    {fmtDate(DateTime.fromISO(s.start).setZone(tz).toFormat("yyyy-MM-dd"))} —{" "}
                    {fmtTime(s.start)}
                  </span>
                  {s.meetLink && (
                    <a
                      href={s.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-purple underline"
                    >
                      Google Meet
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {status && status.left > 0 && (
          <>
            {/* Controls: calendar system + timezone */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex overflow-hidden rounded-md border">
                <button
                  type="button"
                  onClick={() => setUseJalali(true)}
                  className={`px-4 py-2 text-sm ${useJalali ? "bg-brand-purple text-white" : "bg-white"}`}
                >
                  {isFa ? "شمسی" : "Jalali"}
                </button>
                <button
                  type="button"
                  onClick={() => setUseJalali(false)}
                  className={`px-4 py-2 text-sm ${!useJalali ? "bg-brand-purple text-white" : "bg-white"}`}
                >
                  {isFa ? "میلادی" : "Gregorian"}
                </button>
              </div>
              <label className="flex items-center gap-2 text-sm">
                {t.timezone}
                <select
                  value={tz}
                  onChange={(e) => setTz(e.target.value)}
                  className="max-w-60 rounded border px-2 py-2"
                >
                  {timezones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Dates */}
              <div className="rounded-lg border bg-white p-4">
                <div className="mb-3 text-sm text-gray-600">{t.selectDate}</div>
                <div className="max-h-96 space-y-1 overflow-y-auto">
                  {dates.length === 0 && <p className="text-gray-400">{t.noSlots}</p>}
                  {dates.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedSlot(null);
                      }}
                      className={`block w-full rounded px-3 py-2 text-start text-sm transition-colors ${
                        selectedDate === d ? "bg-brand-purple text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {fmtDate(d)}{" "}
                      <span className={selectedDate === d ? "opacity-80" : "text-gray-400"}>
                        ({(byDate.get(d) ?? []).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slots for selected date */}
              <div className="rounded-lg border bg-white p-4">
                {selectedDate ? (
                  <>
                    <div className="mb-3 text-sm text-gray-600">
                      {t.availableSlots} {fmtDate(selectedDate)} ({t.localTime}: {tz})
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(byDate.get(selectedDate) ?? []).map((iso) => (
                        <button
                          type="button"
                          key={iso}
                          onClick={() => setSelectedSlot(iso)}
                          className={`rounded border px-2 py-2 text-sm transition-colors ${
                            selectedSlot === iso
                              ? "border-brand-purple bg-brand-purple text-white"
                              : "hover:border-brand-purple"
                          }`}
                          dir="ltr"
                        >
                          {fmtTime(iso)}
                        </button>
                      ))}
                    </div>

                    {selectedSlot && (
                      <div className="mt-5 border-t pt-4">
                        <div className="mb-3 text-sm">
                          {t.selected} <b dir="ltr">{fmtTime(selectedSlot)}</b> —{" "}
                          {fmtDate(selectedDate)}
                        </div>
                        <div className="mb-3">
                          <div className="mb-1 text-sm text-gray-600">{t.guestsLabel}</div>
                          {guests.map((g, i) => (
                            <div key={`guest-${i}-${g}`} className="mb-1 flex gap-2">
                              <input
                                value={g}
                                onChange={(e) =>
                                  setGuests(guests.map((x, j) => (j === i ? e.target.value : x)))
                                }
                                placeholder={t.guestEmailPlaceholder}
                                className="flex-grow rounded border px-2 py-1.5 text-sm"
                                dir="ltr"
                              />
                              <button
                                type="button"
                                onClick={() => setGuests(guests.filter((_, j) => j !== i))}
                                className="text-red-500"
                                aria-label={t.removeGuest}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          {guests.length < 10 && (
                            <button
                              type="button"
                              onClick={() => setGuests([...guests, ""])}
                              className="text-sm text-brand-purple"
                            >
                              {t.addGuest}
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={book}
                          disabled={booking}
                          className="w-full rounded-md bg-brand-purple py-2.5 font-medium text-white hover:bg-brand-purple/90 disabled:opacity-50"
                        >
                          {booking ? t.booking : t.bookNow}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400">{t.selectDate}</p>
                )}
              </div>
            </div>
          </>
        )}

        {status && status.totalSessions === 0 && (
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-brand-purple px-6 py-2.5 text-white"
          >
            {isFa ? "بازگشت به خانه" : "Back to home"}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Schedule;
