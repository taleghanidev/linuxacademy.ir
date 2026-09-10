"use client";

import {
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Layers,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import FaqAccordion from "@/components/FaqAccordion";
import PageShell, { useIsFa } from "@/components/PageShell";
import { AI_AGENT_COURSE, lastSessionDate } from "@/config/courses";
import aiAgentCourseEn from "@/language/en/pages/aiAgentCourse";
import aiAgentCourseFa from "@/language/fa/pages/aiAgentCourse";
import { formatCourseDate, formatMoney, formatRial, formatTomanEn } from "@/lib/format";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

type Module = {
  n: string;
  title: string;
  summary: string;
  lessons: string;
  duration: string;
  lessonList?: string[];
};

/** The claim of the course, shown rather than asserted. */
const AGENT_FOLDER: Array<{ prefix: string; name: string; note?: string; dir?: boolean }> = [
  { prefix: "", name: "my-agent/", dir: true },
  { prefix: "├── ", name: "agent.md", note: "what it should do" },
  { prefix: "├── ", name: "tools/", dir: true },
  { prefix: "│   ├── ", name: "search.md", note: "a tool it can call" },
  { prefix: "│   └── ", name: "send-email.md", note: "another one" },
  { prefix: "└── ", name: ".env", note: "keys, never committed" },
];

/** Collapsed module row; opens to its lessons. */
function ModuleRow({ m, isFa }: { m: Module; isFa: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn-bare flex w-full items-center gap-4 border-0 bg-transparent px-4 py-3.5 text-start transition-colors hover:bg-brand-tint"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-purple/10 text-sm font-bold text-brand-purple">
          {m.n}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-gray-900">{m.title}</span>
          <span className="flex items-center gap-2 text-xs text-gray-500">
            <span>{m.lessons}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{m.duration}</span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300",
            open && "rotate-180 text-brand-purple",
          )}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="mb-3 text-sm text-gray-600">{m.summary}</p>
            <ol className="space-y-1.5">
              {m.lessonList?.map((lesson, i) => (
                <li key={lesson} className="flex gap-2.5 text-sm text-gray-700">
                  <span className="w-5 shrink-0 text-end text-xs tabular-nums text-gray-400">
                    {isFa ? (i + 1).toLocaleString("fa-IR") : i + 1}
                  </span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

const AiAgentCourse = () => {
  const isFa = useIsFa();
  const lang = isFa ? aiAgentCourseFa : aiAgentCourseEn;
  const course = AI_AGENT_COURSE;
  const priceIran = isFa ? formatRial(course.price) : formatTomanEn(course.price);
  const priceIntl = formatMoney(course.priceAud, "AUD");
  const priceWas = isFa ? formatRial(course.priceOriginal) : formatTomanEn(course.priceOriginal);

  const startsOn = formatCourseDate(course.startDate, isFa);
  const endsOn = formatCourseDate(lastSessionDate(course), isFa);

  const facts = [
    { icon: CalendarDays, label: lang.quickFacts.starts.label, value: startsOn },
    { icon: Calendar, ...lang.quickFacts.when },
    { icon: Clock, ...lang.quickFacts.duration },
    { icon: Layers, ...lang.quickFacts.content },
    { icon: Users, ...lang.quickFacts.seats },
  ];

  const cta = (size: "lg" | "md" = "md") => (
    <Link
      to="/courses/ai-agent-course/register"
      className={cn(
        "inline-block rounded-lg bg-brand-purple font-medium text-white transition-colors hover:bg-brand-purple-dark",
        size === "lg" ? "px-7 py-3.5 text-lg" : "px-6 py-3",
      )}
    >
      {lang.ctaEnroll}
    </Link>
  );

  return (
    <PageShell container={false}>
      {/* ── Hero: the promise, and the proof beside it ───────────────────── */}
      <header className="border-b border-gray-100 bg-gradient-to-b from-brand-tint to-white pt-28 pb-16">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="mb-5 inline-block rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-medium text-brand-purple">
                {lang.eyebrow}
              </span>
              <h1 className="mb-5 text-4xl font-bold leading-[1.15] md:text-5xl">{lang.title}</h1>
              <p className="mb-8 max-w-xl text-xl leading-relaxed text-gray-600">{lang.subtitle}</p>
              <p className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm">
                <CalendarDays className="h-4 w-4 text-brand-purple" />
                {lang.quickFacts.starts.label}: {startsOn}
                <span className="font-normal text-gray-400">
                  {"\u2192"} {endsOn}
                </span>
              </p>
              <div className="mb-6 flex flex-wrap items-center gap-4">
                {cta("lg")}
                <a
                  href="#curriculum"
                  className="text-brand-purple underline-offset-4 hover:underline"
                >
                  {lang.ctaSyllabus}
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                <span className="text-gray-400 line-through">{priceWas}</span>
                <span className="font-bold text-gray-900">{priceIran}</span>
                <span>{lang.pricing.priceIran}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span className="font-bold text-gray-900">{priceIntl}</span>
                <span>{lang.pricing.priceIntl}</span>
              </div>
            </div>

            {/* the folder, shown not claimed */}
            <div dir="ltr" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <pre
                // A file tree only reads correctly left to right; the page
                // around it is RTL, so force both direction and alignment.
                style={{ direction: "ltr", textAlign: "left" }}
                className="overflow-x-auto font-mono text-sm leading-7 text-gray-800"
              >
                {AGENT_FOLDER.map((row) => (
                  <div key={row.name} className="whitespace-pre">
                    <span className="text-gray-300">{row.prefix}</span>
                    <span className={row.dir ? "font-semibold text-brand-purple" : ""}>
                      {row.name}
                    </span>
                    {row.note && <span className="text-gray-400">{`   # ${row.note}`}</span>}
                  </div>
                ))}
              </pre>
              <p dir={isFa ? "rtl" : "ltr"} className="mt-4 text-xs text-gray-500">
                {lang.proof.caption}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Facts strip ──────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid gap-x-6 gap-y-5 py-6 sm:grid-cols-2 lg:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3">
                <fact.icon className="h-5 w-5 shrink-0 text-brand-purple" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">{fact.label}</div>
                  <div className="text-sm font-medium text-gray-900">{fact.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why a folder ─────────────────────────────────────────────────── */}
      <section className="bg-brand-tint py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold">{lang.proof.heading}</h2>
          <p className="text-lg leading-relaxed text-gray-700">{lang.proof.body}</p>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl py-16">
        <div className="space-y-16">
          {/* ── Outcomes ───────────────────────────────────────────────── */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">{lang.outcomes.heading}</h2>
            <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {lang.outcomes.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-gray-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-brand-purple" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── How sessions run ───────────────────────────────────────── */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">{lang.format.heading}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {lang.format.items.map((f) => (
                <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="mb-1.5 font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Syllabus ───────────────────────────────────────────────── */}
          <section id="curriculum">
            <h2 className="mb-2 text-3xl font-bold">{lang.curriculum.heading}</h2>
            <p className="mb-6 text-gray-600">{lang.curriculum.note}</p>
            <div className="space-y-2">
              {(lang.curriculum.modules as Module[]).map((m) => (
                <ModuleRow key={m.n} m={m} isFa={isFa} />
              ))}
            </div>
          </section>

          {/* ── Who it is for ──────────────────────────────────────────── */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">{lang.audience.heading}</h2>
            <ul className="mb-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {lang.audience.forItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-gray-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-brand-purple" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                {lang.audience.notForHeading}
              </h3>
              <ul className="space-y-2">
                {lang.audience.notForItems.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-gray-600">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Included + tools ───────────────────────────────────────── */}
          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-bold">{lang.includes.heading}</h2>
              <ul className="space-y-2.5">
                {lang.includes.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-gray-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-xl font-bold">{lang.tools.heading}</h2>
              <div className="flex flex-wrap gap-2">
                {lang.tools.items.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700"
                  >
                    <Wrench className="h-3.5 w-3.5 text-brand-purple" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Instructor ─────────────────────────────────────────────── */}
          <section className="flex flex-col gap-5 rounded-xl bg-brand-tint p-6 sm:flex-row sm:items-center">
            <img
              src="/images/about-me.webp"
              alt={lang.instructor.name}
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{lang.instructor.name}</h2>
              <p className="mb-2 text-sm text-brand-purple">{lang.instructor.role}</p>
              <p className="text-sm leading-relaxed text-gray-700">{lang.instructor.bio}</p>
            </div>
          </section>
        </div>
      </div>

      {/* ── Price + CTA ──────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-brand-tint py-16">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-brand-purple bg-white p-8 text-center">
            <div className="mb-5 text-sm font-medium text-brand-purple">
              {lang.pricing.priceLabel}
            </div>
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-brand-tint p-5">
                <div className="mb-1 text-xs text-gray-500">{lang.pricing.priceIran}</div>
                <div className="text-sm text-gray-400 line-through">{priceWas}</div>
                <div className="text-3xl font-bold text-gray-900">{priceIran}</div>
              </div>
              <div className="rounded-xl bg-brand-tint p-5">
                <div className="mb-1 text-xs text-gray-500">{lang.pricing.priceIntl}</div>
                <div className="text-3xl font-bold text-gray-900">{priceIntl}</div>
              </div>
            </div>
            <p
              role="note"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-start text-sm font-medium leading-relaxed text-red-700"
            >
              {lang.pricing.residencyWarning}
            </p>
            <p className="mb-6 text-sm text-gray-600">{lang.pricing.priceNote}</p>
            {cta("lg")}
            <p className="mt-4 text-sm text-gray-500">{lang.enroll.ctaNote}</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-3xl py-16">
        <h2 className="mb-6 text-3xl font-bold">{lang.faq.heading}</h2>
        <FaqAccordion
          items={lang.faq.items.map((f, idx) => ({
            id: idx,
            question: f.question,
            answer: f.answer,
          }))}
        />
      </div>
    </PageShell>
  );
};

export default AiAgentCourse;
