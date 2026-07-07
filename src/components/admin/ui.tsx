// Reusable admin dashboard building blocks (server-safe, no client JS needed).

import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

/* ---------- Stat card ---------- */

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "purple",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accent?: "purple" | "magenta" | "cyan" | "green" | "amber";
}) {
  const accents: Record<string, string> = {
    purple: "from-brand-purple/15 to-brand-purple/5 text-brand-purple",
    magenta: "from-brand-magenta/15 to-brand-magenta/5 text-brand-magenta",
    cyan: "from-brand-cyan/15 to-brand-cyan/5 text-brand-cyan-dark",
    green: "from-green-500/15 to-green-500/5 text-green-700",
    amber: "from-amber-500/15 to-amber-500/5 text-amber-700",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`absolute -end-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accents[accent]}`}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          {icon}
          {label}
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
        {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------- Section panel ---------- */

export function SectionCard({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="p-2 sm:p-4">{children}</div>
    </section>
  );
}

/* ---------- Status badge ---------- */

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 ring-green-600/20",
  PENDING: "bg-amber-100 text-amber-800 ring-amber-600/20",
  FAILED: "bg-red-100 text-red-700 ring-red-600/20",
  CANCELED: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 ring-gray-500/20"
      }`}
    >
      {label ?? status}
    </span>
  );
}

/* ---------- Generic data table ---------- */

export type Column<Row> = {
  header: string;
  cell: (row: Row) => ReactNode;
  className?: string;
};

export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  empty,
}: {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  empty: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-gray-400">
            {columns.map((c) => (
              <th key={c.header} className={`px-3 py-2 font-medium ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState message={empty} />
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-t border-gray-100 transition-colors hover:bg-gray-50/70"
            >
              {columns.map((c) => (
                <td key={c.header} className={`px-3 py-3 align-top ${c.className ?? ""}`}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Inbox className="h-6 w-6 text-gray-300" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

/* ---------- Two-line cell helpers ---------- */

export function CustomerCell({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone?: string;
}) {
  return (
    <div>
      <div className="font-medium text-gray-900">{name}</div>
      <div className="text-xs text-gray-400">{email}</div>
      {phone && (
        <div className="text-xs text-gray-400" dir="ltr">
          {phone}
        </div>
      )}
    </div>
  );
}
