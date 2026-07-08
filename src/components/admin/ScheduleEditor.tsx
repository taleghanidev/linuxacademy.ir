"use client";

import { Loader2, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import adminFa from "@/language/fa/admin";
import type { ScheduleSettings } from "@/lib/schedule-settings";

const t = adminFa.schedule;

// Iranian week order for display; keys match the config/day names.
const DAY_ORDER = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

type Range = { from: string; to: string };

const inputCls =
  "rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple";

export default function ScheduleEditor({ initial }: { initial: ScheduleSettings }) {
  const [weekly, setWeekly] = useState<Record<string, Range[]>>(initial.weeklyHours);
  const [minNotice, setMinNotice] = useState(String(initial.minNoticeHours));
  const [horizon, setHorizon] = useState(String(initial.bookingHorizonDays));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const setRange = (day: string, idx: number, patch: Partial<Range>) => {
    setWeekly((w) => ({
      ...w,
      [day]: (w[day] ?? []).map((r, i) => (i === idx ? { ...r, ...patch } : r)),
    }));
  };
  const addRange = (day: string) => {
    setWeekly((w) => ({ ...w, [day]: [...(w[day] ?? []), { from: "10:00", to: "18:00" }] }));
  };
  const removeRange = (day: string, idx: number) => {
    setWeekly((w) => ({ ...w, [day]: (w[day] ?? []).filter((_, i) => i !== idx) }));
  };

  async function save() {
    setMsg(null);
    // client-side sanity: from < to
    for (const day of DAY_ORDER) {
      for (const r of weekly[day] ?? []) {
        if (r.from >= r.to) {
          setMsg({ ok: false, text: `${t.days[day]}: ${t.invalidRange}` });
          return;
        }
      }
    }
    setBusy(true);
    try {
      // Drop empty days so the payload stays tidy.
      const weeklyHours = Object.fromEntries(
        Object.entries(weekly).filter(([, ranges]) => ranges.length > 0),
      );
      const res = await fetch("/api/admin/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyHours,
          minNoticeHours: Number(minNotice),
          bookingHorizonDays: Number(horizon),
        }),
      });
      setMsg(res.ok ? { ok: true, text: t.saved } : { ok: false, text: t.error });
    } catch {
      setMsg({ ok: false, text: t.error });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Weekly hours */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <ul className="divide-y">
          {DAY_ORDER.map((day) => {
            const ranges = weekly[day] ?? [];
            return (
              <li key={day} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className="w-20 shrink-0 text-sm font-medium">{t.days[day]}</span>
                {ranges.length === 0 && <span className="text-xs text-gray-400">{t.closed}</span>}
                <div className="flex flex-wrap items-center gap-2">
                  {ranges.map((r, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: ranges have no stable id
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 p-1.5"
                    >
                      <span className="text-xs text-gray-400">{t.from}</span>
                      <input
                        type="time"
                        value={r.from}
                        onChange={(e) => setRange(day, idx, { from: e.target.value })}
                        className={inputCls}
                        dir="ltr"
                      />
                      <span className="text-xs text-gray-400">{t.to}</span>
                      <input
                        type="time"
                        value={r.to}
                        onChange={(e) => setRange(day, idx, { to: e.target.value })}
                        className={inputCls}
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => removeRange(day, idx)}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={t.closed}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  {ranges.length < 4 && (
                    <button
                      type="button"
                      onClick={() => addRange(day)}
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-2.5 py-1.5 text-xs text-gray-500 transition-colors hover:border-brand-purple hover:text-brand-purple"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {t.addRange}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Notice + horizon */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
          <span className="mb-1.5 block font-medium text-gray-700">{t.minNotice}</span>
          <input
            type="number"
            min={0}
            max={168}
            value={minNotice}
            onChange={(e) => setMinNotice(e.target.value)}
            className={`${inputCls} w-full`}
            dir="ltr"
          />
        </label>
        <label className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
          <span className="mb-1.5 block font-medium text-gray-700">{t.horizon}</span>
          <input
            type="number"
            min={1}
            max={90}
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className={`${inputCls} w-full`}
            dir="ltr"
          />
        </label>
      </div>

      {msg && <p className={`text-sm ${msg.ok ? "text-green-600" : "text-red-600"}`}>{msg.text}</p>}

      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="flex items-center gap-2 rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-purple-dark disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {busy ? t.saving : t.save}
      </button>
    </div>
  );
}
