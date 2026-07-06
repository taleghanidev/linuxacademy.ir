"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FaqItem = { id: number | string; question: string; answer: string };

/**
 * Smooth, accessible FAQ accordion.
 * Height animates via the CSS grid-rows trick (0fr → 1fr), so it is buttery
 * for any content length without measuring; chevron rotates in sync.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<FaqItem["id"] | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
              open
                ? "border-brand-purple/40 bg-white shadow-sm"
                : "border-transparent bg-[#FAFAFF] hover:bg-gray-100"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              aria-controls={`faq-panel-${item.id}`}
              className="flex w-full items-center justify-between gap-3 p-4 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60 focus-visible:ring-offset-2 rounded-xl"
            >
              <span className={`font-medium transition-colors ${open ? "text-brand-purple" : ""}`}>
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ease-out ${
                  open ? "rotate-180 text-brand-purple" : ""
                }`}
              />
            </button>

            <div
              id={`faq-panel-${item.id}`}
              role="region"
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-hidden">
                <p
                  className={`px-4 pb-4 leading-7 text-gray-600 transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
