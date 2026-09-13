"use client";

import {
  Check,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CourseEnrollment } from "@/db";
import adminFa from "@/language/fa/admin";
import { formatDateTime, formatMoney, formatRial } from "@/lib/format";
import { EmptyState, StatusBadge } from "./ui";

const t = adminFa.enrollments;
type Action = "confirm" | "reject" | "pending" | "email";
type Filter = "" | CourseEnrollment["status"];

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple";

function EnrollmentCard({ e }: { e: CourseEnrollment }) {
  const router = useRouter();
  const [note, setNote] = useState(e.reviewNote ?? "");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState<Action | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function run(action: Action) {
    if (action === "reject" && !window.confirm(t.confirmReject)) return;
    setBusy(action);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/enrollments/${e.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewNote: note, notify }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: t.error });
        return;
      }
      const wantedEmail =
        action === "email" || (notify && action !== "pending");
      setMsg(
        !wantedEmail
          ? { ok: true, text: t.saved }
          : !data.hasEmail
            ? { ok: true, text: t.savedNoEmail }
            : data.emailed
              ? { ok: true, text: t.emailed }
              : { ok: false, text: t.emailFailed },
      );
      router.refresh();
    } catch {
      setMsg({ ok: false, text: t.error });
    } finally {
      setBusy(null);
    }
  }

  const amount =
    e.currency === "AUD" ? formatMoney(e.amount, "AUD") : formatRial(e.amount);
  const btn =
    "btn-bare inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const icon = (a: Action, I: typeof Check) =>
    busy === a ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <I className="h-4 w-4" />
    );

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-gray-900">{e.fullName}</div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <a
              href={`tel:${e.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1 hover:text-brand-purple"
              dir="ltr"
            >
              <Phone className="h-3.5 w-3.5" />
              {e.phone}
            </a>
            {e.email ? (
              <a
                href={`mailto:${e.email}`}
                className="inline-flex items-center gap-1 hover:text-brand-purple"
                dir="ltr"
              >
                <Mail className="h-3.5 w-3.5" />
                {e.email}
              </a>
            ) : (
              <span className="text-gray-400">{t.noEmail}</span>
            )}
          </div>
        </div>
        <StatusBadge status={e.status} label={adminFa.status[e.status]} />
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-gray-500">{adminFa.cols.course}:</dt>
          <dd>{e.courseSlug}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-500">{adminFa.cols.amount}:</dt>
          <dd className="font-medium">{amount}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-500">{t.region}:</dt>
          <dd>{e.payRegion === "international" ? t.intl : t.iran}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-500">{adminFa.cols.date}:</dt>
          <dd>{formatDateTime(e.createdAt, "Asia/Tehran")}</dd>
        </div>
        {e.reviewedAt && (
          <div className="flex gap-2">
            <dt className="text-gray-500">{t.reviewedAt}:</dt>
            <dd>{formatDateTime(e.reviewedAt, "Asia/Tehran")}</dd>
          </div>
        )}
      </dl>
      {e.note && (
        <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {e.note}
        </p>
      )}

      <a
        href={e.receiptUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-purple hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {adminFa.cols.receipt}
      </a>

      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
        <textarea
          rows={2}
          value={note}
          onChange={(ev) => setNote(ev.target.value)}
          placeholder={t.notePlaceholder}
          className={inputCls}
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={notify}
            onChange={(ev) => setNotify(ev.target.checked)}
            disabled={!e.email}
          />
          {e.email ? t.notify : t.notifyNoEmail}
        </label>
        <div className="flex flex-wrap gap-2">
          {e.status !== "CONFIRMED" && (
            <button
              type="button"
              disabled={!!busy}
              onClick={() => run("confirm")}
              className={`${btn} border-0 bg-green-600 text-white hover:bg-green-700`}
            >
              {icon("confirm", Check)}
              {t.confirm}
            </button>
          )}
          {e.status !== "REJECTED" && (
            <button
              type="button"
              disabled={!!busy}
              onClick={() => run("reject")}
              className={`${btn} border border-red-200 bg-white text-red-700 hover:bg-red-50`}
            >
              {icon("reject", X)}
              {t.reject}
            </button>
          )}
          {e.email && (
            <button
              type="button"
              disabled={!!busy}
              onClick={() => run("email")}
              className={`${btn} border border-gray-200 bg-white text-gray-700 hover:border-brand-purple`}
            >
              {icon("email", Mail)}
              {t.resend}
            </button>
          )}
          {e.status !== "PENDING_REVIEW" && (
            <button
              type="button"
              disabled={!!busy}
              onClick={() => run("pending")}
              className={`${btn} border border-gray-200 bg-white text-gray-500 hover:border-brand-purple`}
            >
              {icon("pending", RotateCcw)}
              {t.backToPending}
            </button>
          )}
        </div>
        {msg && (
          <p
            role="status"
            className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </article>
  );
}

export default function EnrollmentManager({
  enrollments,
}: {
  enrollments: CourseEnrollment[];
}) {
  const [filter, setFilter] = useState<Filter>("PENDING_REVIEW");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { "": enrollments.length };
    for (const e of enrollments) c[e.status] = (c[e.status] ?? 0) + 1;
    return c;
  }, [enrollments]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrollments.filter(
      (e) =>
        (!filter || e.status === filter) &&
        (!q ||
          [e.fullName, e.email, e.phone, e.note ?? ""].some((v) =>
            v.toLowerCase().includes(q),
          )),
    );
  }, [enrollments, filter, query]);

  const tabs: Filter[] = ["PENDING_REVIEW", "CONFIRMED", "REJECTED", ""];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((s) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => setFilter(s)}
            className={`btn-bare rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === s
                ? "border-0 bg-brand-purple text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:border-brand-purple"
            }`}
          >
            {s ? adminFa.status[s] : adminFa.table.allStatuses} (
            {counts[s] ?? 0})
          </button>
        ))}
        <div className="relative ms-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute top-2.5 right-3 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={adminFa.table.search}
            className={`${inputCls} pr-9`}
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState message={adminFa.empty.enrollments} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {shown.map((e) => (
            <EnrollmentCard key={e.id} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}
