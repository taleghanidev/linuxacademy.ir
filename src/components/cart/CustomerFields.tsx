"use client";

import { Mail, Phone, User } from "lucide-react";

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type CustomerFieldsProps = {
  value: Customer;
  onChange: (value: Customer) => void;
  labels: { name: string; email: string; phone: string };
};

const ICONS = { name: User, email: Mail, phone: Phone } as const;

/** Reusable customer contact fields (name / email / phone) with leading icons. */
export default function CustomerFields({ value, onChange, labels }: CustomerFieldsProps) {
  const fields: Array<{ key: keyof Customer; type: string }> = [
    { key: "name", type: "text" },
    { key: "email", type: "email" },
    { key: "phone", type: "tel" },
  ];

  return (
    <div className="space-y-3">
      {fields.map(({ key, type }) => {
        const Icon = ICONS[key];
        return (
          <div key={key} className="relative">
            <Icon className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-gray-400" />
            <input
              required
              type={type}
              placeholder={labels[key]}
              value={value[key]}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
              className="w-full rounded-lg border border-gray-200 py-2.5 pe-3 ps-9 text-sm outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
          </div>
        );
      })}
    </div>
  );
}
