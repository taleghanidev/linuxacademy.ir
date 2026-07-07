"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDateTime, formatRial } from "@/lib/format";
import { EmptyState, StatusBadge } from "./ui";

export type AdminColumnType = "text" | "money" | "date" | "status" | "customer" | "number";

export type AdminColumn = {
  key: string;
  header: string;
  type?: AdminColumnType;
  sortable?: boolean;
  className?: string;
};

export type AdminRow = Record<string, unknown>;

type Props = {
  columns: AdminColumn[];
  rows: AdminRow[];
  searchKeys?: string[];
  statusKey?: string;
  statusLabels?: Record<string, string>;
  labels: { search: string; allStatuses: string };
  empty: string;
};

type CustomerValue = { name?: string; email?: string; phone?: string };

function searchableText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") return Object.values(value).map(String).join(" ");
  return String(value);
}

function sortValue(value: unknown, type?: AdminColumnType): number | string {
  if (value == null) return "";
  if (type === "money" || type === "number") return Number(value) || 0;
  if (type === "date") {
    const t = new Date(value as string).getTime();
    return Number.isNaN(t) ? 0 : t;
  }
  if (type === "customer") return (value as CustomerValue).name ?? "";
  return String(value).toLowerCase();
}

export default function AdminTable({
  columns,
  rows,
  searchKeys = [],
  statusKey,
  statusLabels,
  labels,
  empty,
}: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const statuses = useMemo(() => {
    if (!statusKey) return [];
    return [...new Set(rows.map((r) => String(r[statusKey] ?? "")).filter(Boolean))];
  }, [rows, statusKey]);

  const filtered = useMemo(() => {
    let out = rows;
    if (statusKey && statusFilter) out = out.filter((r) => String(r[statusKey]) === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      const keys = searchKeys.length ? searchKeys : columns.map((c) => c.key);
      out = out.filter((r) => keys.some((k) => searchableText(r[k]).toLowerCase().includes(q)));
    }
    if (sortKey) {
      const type = columns.find((c) => c.key === sortKey)?.type;
      out = [...out].sort((a, b) => {
        const av = sortValue(a[sortKey], type);
        const bv = sortValue(b[sortKey], type);
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return out;
  }, [rows, query, statusFilter, sortKey, sortDir, statusKey, searchKeys, columns]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  function renderCell(row: AdminRow, col: AdminColumn) {
    const value = row[col.key];
    switch (col.type) {
      case "money":
        return <span className="font-medium">{formatRial(Number(value) || 0)}</span>;
      case "number":
        return <span className="tabular-nums">{Number(value) || 0}</span>;
      case "date":
        return (
          <span className="whitespace-nowrap text-gray-600">{formatDateTime(value as string)}</span>
        );
      case "status": {
        const s = String(value ?? "");
        return <StatusBadge status={s} label={statusLabels?.[s]} />;
      }
      case "customer": {
        const c = (value ?? {}) as CustomerValue;
        return (
          <div>
            <div className="font-medium text-gray-900">{c.name}</div>
            <div className="text-xs text-gray-400">{c.email}</div>
            {c.phone && (
              <div className="text-xs text-gray-400" dir="ltr">
                {c.phone}
              </div>
            )}
          </div>
        );
      }
      default:
        return (
          <span className="whitespace-pre-wrap break-words text-gray-700">
            {String(value ?? "—")}
          </span>
        );
    }
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-grow sm:max-w-xs">
          <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            className="w-full rounded-lg border border-gray-200 py-2 pe-3 ps-9 text-sm outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
          />
        </div>
        {statusKey && statuses.length > 0 && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-purple"
          >
            <option value="">{labels.allStatuses}</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels?.[s] ?? s}
              </option>
            ))}
          </select>
        )}
        <span className="ms-auto text-xs text-gray-400 tabular-nums">{filtered.length}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="text-xs text-gray-400">
              {columns.map((c) => {
                const active = sortKey === c.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;
                return (
                  <th key={c.key} className={`px-3 py-2 font-medium ${c.className ?? ""}`}>
                    {c.sortable === false ? (
                      c.header
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={`inline-flex items-center gap-1 transition-colors hover:text-gray-700 ${
                          active ? "text-gray-700" : ""
                        }`}
                      >
                        {c.header}
                        <Icon className="h-3 w-3" />
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState message={empty} />
                </td>
              </tr>
            )}
            {filtered.map((row, i) => (
              <tr
                key={String(row.id ?? i)}
                className="border-t border-gray-100 transition-colors hover:bg-gray-50/70"
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-3 py-3 align-top ${c.className ?? ""}`}>
                    {renderCell(row, c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
