"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CouponRow } from "@/db";
import adminFa from "@/language/fa/admin";
import { formatRial } from "@/lib/format";

const t = adminFa.coupons;

const emptyForm = {
  code: "",
  type: "percentage" as "percentage" | "fixed",
  value: "",
  minSubtotal: "",
  appliesTo: "all" as "all" | "booking" | "sponsorship",
  expiresAt: "",
  usageLimit: "",
};

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple";

export default function CouponManager({ initial }: { initial: CouponRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scopeLabel = (s: string) =>
    s === "booking" ? t.booking : s === "sponsorship" ? t.sponsorship : t.all;

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value),
          minSubtotal: form.minSubtotal ? Number(form.minSubtotal) : 0,
          appliesTo: form.appliesTo,
          expiresAt: form.expiresAt || null,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "duplicate" ? t.duplicate : t.error);
        return;
      }
      setForm(emptyForm);
      router.refresh();
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }

  async function toggle(c: CouponRow) {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Create form */}
      <form onSubmit={create} className="h-fit space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold">{t.createTitle}</h3>

        <input
          required
          placeholder={t.code}
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          className={`${inputCls} font-mono uppercase`}
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
            className={inputCls}
          >
            <option value="percentage">{t.percentage}</option>
            <option value="fixed">{t.fixed}</option>
          </select>
          <input
            required
            type="number"
            min={1}
            placeholder={t.value}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className={inputCls}
          />
        </div>

        <select
          value={form.appliesTo}
          onChange={(e) => setForm({ ...form, appliesTo: e.target.value as typeof form.appliesTo })}
          className={inputCls}
        >
          <option value="all">{t.all}</option>
          <option value="booking">{t.booking}</option>
          <option value="sponsorship">{t.sponsorship}</option>
        </select>

        <input
          type="number"
          min={0}
          placeholder={t.minSubtotal}
          value={form.minSubtotal}
          onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })}
          className={inputCls}
        />

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-gray-500">
            {t.expiresAt}
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="text-xs text-gray-500">
            {t.usageLimit}
            <input
              type="number"
              min={1}
              placeholder={t.unlimited}
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              className={`${inputCls} mt-1`}
            />
          </label>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-purple py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-purple-dark disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {busy ? t.creating : t.create}
        </button>
      </form>

      {/* Existing coupons */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-5 py-3 text-sm font-semibold">{t.existing}</div>
          {initial.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">{adminFa.empty.coupons}</p>
          ) : (
            <ul className="divide-y">
              {initial.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold uppercase">{c.code}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.active ? t.active : t.inactive}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {c.type === "percentage" ? `${c.value}٪` : formatRial(c.value)} ·{" "}
                      {scopeLabel(c.appliesTo)}
                      {c.minSubtotal > 0 && ` · ${t.minSubtotal}: ${formatRial(c.minSubtotal)}`} ·{" "}
                      {t.used}: {c.usedCount}
                      {c.usageLimit ? `/${c.usageLimit}` : ` (${t.unlimited})`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(c)}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    {c.active ? t.disable : t.enable}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={t.delete}
                    title={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
