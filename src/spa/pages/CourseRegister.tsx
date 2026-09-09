"use client";

import { ArrowDown, Building2, Check, CheckCircle2, Copy, Landmark, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";
import PageShell, { useIsFa } from "@/components/PageShell";
import {
  AI_AGENT_COURSE,
  BANK_TRANSFER,
  BANK_TRANSFER_INTL,
  type PayRegion,
} from "@/config/courses";
import courseRegisterEn from "@/language/en/pages/courseRegister";
import courseRegisterFa from "@/language/fa/pages/courseRegister";
import { formatMoney, formatRial, formatTomanEn } from "@/lib/format";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "done";

/** One bank field with a copy-to-clipboard button. */
function BankRow({
  label,
  value,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/[\s-]/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the value is on screen to copy by hand.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 py-2.5 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-medium tabular-nums" dir="ltr">
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copyLabel}
          className="btn-bare flex h-7 w-7 items-center justify-center rounded-md border-0 bg-transparent text-gray-400 transition-colors hover:bg-brand-purple/10 hover:text-brand-purple"
        >
          {copied ? <Check className="h-4 w-4 text-brand-purple" /> : <Copy className="h-4 w-4" />}
        </button>
        <span className="sr-only" role="status">
          {copied ? copiedLabel : ""}
        </span>
      </span>
    </div>
  );
}

const CourseRegister = () => {
  const isFa = useIsFa();
  const lang = isFa ? courseRegisterFa : courseRegisterEn;
  const course = AI_AGENT_COURSE;
  // Which account the student pays into decides both the fee and the details
  // shown. The server recomputes the amount from this, never trusting the page.
  const [region, setRegion] = useState<PayRegion>("iran");
  const intl = region === "international";
  const fee = intl
    ? formatMoney(course.priceAud, "AUD")
    : isFa
      ? formatRial(course.price)
      : formatTomanEn(course.price);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const ids = { name: useId(), email: useId(), phone: useId(), note: useId(), file: useId() };

  const errorText = (code: string) =>
    (lang.errors as Record<string, string>)[code] ?? lang.errors.generic;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setError(null);

    const form = new FormData(e.currentTarget);
    form.set("courseSlug", course.slug);
    form.set("payRegion", region);

    // Check the file here too, so the common mistake never costs a round trip.
    const file = form.get("receipt");
    if (!(file instanceof File) || file.size === 0) {
      setError(errorText("receipt_required"));
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/course-enrollment", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(errorText(data.error ?? "generic"));
        setStatus("idle");
        return;
      }
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(lang.errors.generic);
      setStatus("idle");
    }
  };

  const reset = () => {
    formRef.current?.reset();
    setFileName(null);
    setError(null);
    setStatus("idle");
  };

  const field =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20";

  if (status === "done") {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple/10">
            <CheckCircle2 className="h-8 w-8 text-brand-purple" />
          </div>
          <h1 className="mb-3 text-2xl font-bold">{lang.success.heading}</h1>
          <p className="mb-8 text-gray-600">{lang.success.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/courses/ai-agent-course"
              className="rounded-md bg-brand-purple px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-purple-dark"
            >
              {lang.success.backToCourse}
            </Link>
            <button
              type="button"
              onClick={reset}
              className="btn-bare rounded-md border border-gray-300 bg-white px-5 py-2.5 text-gray-700 transition-colors hover:border-brand-purple"
            >
              {lang.success.another}
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl">
        <span className="mb-3 inline-block rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-medium text-brand-purple">
          {lang.eyebrow}
        </span>
        <h1 className="mb-3 text-3xl font-bold">{lang.title}</h1>
        <p className="mb-6 text-gray-600">{lang.intro}</p>

        <h2 className="mb-1 text-lg font-bold">{lang.region.heading}</h2>
        <p className="mb-3 text-sm text-gray-600">{lang.region.note}</p>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {(["iran", "international"] as PayRegion[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              aria-pressed={region === r}
              className={cn(
                "btn-bare rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                region === r
                  ? "border-2 border-brand-purple bg-brand-purple/5 text-brand-purple"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-brand-purple",
              )}
            >
              {r === "iran" ? lang.region.iran : lang.region.international}
            </button>
          ))}
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-brand-purple bg-white p-5">
          <span className="text-sm font-medium text-brand-purple">{lang.feeLabel}</span>
          <span className="text-2xl font-bold text-gray-900">{fee}</span>
        </div>

        {/* ── Three steps ──────────────────────────────────────────────── */}
        <h2 className="mb-4 text-xl font-bold">{lang.steps.heading}</h2>
        <div className="mb-10 space-y-4">
          {lang.steps.items.map((step, idx) => (
            <div className="flex gap-4" key={step.title}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 font-bold text-brand-purple">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bank details ─────────────────────────────────────────────── */}
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
          <Landmark className="h-5 w-5 text-brand-purple" />
          {lang.bank.heading}
        </h2>
        <p className="mb-4 text-sm text-gray-600">{lang.bank.note}</p>
        <div className="mb-10 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 py-2.5">
            <span className="text-sm text-gray-500">{lang.bank.bankName}</span>
            <span className="flex items-center gap-2 font-medium">
              <Building2 className="h-4 w-4 text-gray-400" />
              {intl ? BANK_TRANSFER_INTL.bankName : BANK_TRANSFER.bankName}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 py-2.5">
            <span className="text-sm text-gray-500">{lang.bank.accountHolder}</span>
            <span className="font-medium">
              {intl ? BANK_TRANSFER_INTL.accountHolder : BANK_TRANSFER.accountHolder}
            </span>
          </div>
          {(intl
            ? [
                { label: lang.bank.bsb, value: BANK_TRANSFER_INTL.bsb },
                { label: lang.bank.accountNumber, value: BANK_TRANSFER_INTL.accountNumber },
                { label: lang.bank.swift, value: BANK_TRANSFER_INTL.swift },
              ]
            : [
                { label: lang.bank.cardNumber, value: BANK_TRANSFER.cardNumber },
                { label: lang.bank.iban, value: BANK_TRANSFER.iban },
                { label: lang.bank.accountNumber, value: BANK_TRANSFER.accountNumber },
              ]
          ).map((row) => (
            <BankRow
              key={row.label}
              label={row.label}
              value={row.value}
              copyLabel={lang.bank.copy}
              copiedLabel={lang.bank.copied}
            />
          ))}
        </div>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <h2 className="mb-4 text-xl font-bold">{lang.form.heading}</h2>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor={ids.name} className="mb-1.5 block text-sm font-medium text-gray-700">
              {lang.form.fullName}
            </label>
            <input
              id={ids.name}
              name="fullName"
              required
              autoComplete="name"
              placeholder={lang.form.fullNamePlaceholder}
              className={field}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={ids.email} className="mb-1.5 block text-sm font-medium text-gray-700">
                {lang.form.email}
              </label>
              <input
                id={ids.email}
                name="email"
                type="email"
                required
                autoComplete="email"
                dir="ltr"
                placeholder={lang.form.emailPlaceholder}
                className={field}
              />
            </div>
            <div>
              <label htmlFor={ids.phone} className="mb-1.5 block text-sm font-medium text-gray-700">
                {lang.form.phone}
              </label>
              <input
                id={ids.phone}
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                dir="ltr"
                placeholder={lang.form.phonePlaceholder}
                className={field}
              />
            </div>
          </div>

          <div>
            <label htmlFor={ids.file} className="mb-1.5 block text-sm font-medium text-gray-700">
              {lang.form.receipt}
            </label>
            <input
              ref={fileRef}
              id={ids.file}
              name="receipt"
              type="file"
              required
              accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-bare flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600 transition-colors hover:border-brand-purple hover:text-brand-purple"
            >
              <Upload className="h-5 w-5" />
              {fileName ?? lang.form.receiptChoose}
            </button>
            <p className="mt-1.5 text-xs text-gray-500">{lang.form.receiptHint}</p>
          </div>

          <div>
            <label htmlFor={ids.note} className="mb-1.5 block text-sm font-medium text-gray-700">
              {lang.form.note}
            </label>
            <textarea
              id={ids.note}
              name="note"
              rows={3}
              placeholder={lang.form.notePlaceholder}
              className={field}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-bare w-full rounded-md border-0 bg-brand-purple px-5 py-3 font-medium text-white transition-colors hover:bg-brand-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? lang.form.submitting : lang.form.submit}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link
            to="/courses/ai-agent-course"
            className="inline-flex items-center text-brand-purple hover:underline"
          >
            {isFa ? (
              <ArrowDown className="ml-1 h-4 w-4 -rotate-90 transform" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 rotate-90 transform" />
            )}
            {lang.backToCourse}
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

export default CourseRegister;
