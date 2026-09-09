"use client";

import {
  ArrowDown,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Globe,
  GraduationCap,
  Laptop,
  Layers,
  Rocket,
  ShieldCheck,
  Target,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import FaqAccordion from "@/components/FaqAccordion";
import PageShell, { useIsFa } from "@/components/PageShell";
import { AI_AGENT_COURSE } from "@/config/courses";
import aiAgentCourseEn from "@/language/en/pages/aiAgentCourse";
import aiAgentCourseFa from "@/language/fa/pages/aiAgentCourse";
import { formatRial, formatTomanEn } from "@/lib/format";
import { Link } from "@/lib/router";

/** Section wrapper: consistent vertical rhythm and heading treatment. */
function Section({
  id,
  title,
  note,
  children,
}: {
  id?: string;
  title?: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-24">
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {note && <p className="text-gray-600 mb-6">{note}</p>}
      {!note && title && <div className="mb-6" />}
      {children}
    </section>
  );
}

const AiAgentCourse = () => {
  const isFa = useIsFa();
  const lang = isFa ? aiAgentCourseFa : aiAgentCourseEn;
  const course = AI_AGENT_COURSE;

  const facts = [
    { icon: Video, ...lang.quickFacts.format },
    { icon: Calendar, ...lang.quickFacts.when },
    { icon: Clock, ...lang.quickFacts.duration },
    { icon: Layers, ...lang.quickFacts.content },
    { icon: Users, ...lang.quickFacts.seats },
    { icon: Globe, ...lang.quickFacts.language },
    { icon: Target, ...lang.quickFacts.level },
    { icon: BookOpen, ...lang.quickFacts.recording },
  ];

  // Persian shows "تومان"; the English side shows the same amount labelled "Toman".
  const priceLabel = isFa ? formatRial(course.price) : formatTomanEn(course.price);

  return (
    <PageShell container={false}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="bg-gradient-to-b from-brand-tint to-gray-50 pt-28 pb-14 border-b border-gray-100">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-medium text-brand-purple mb-4">
              {lang.eyebrow}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{lang.title}</h1>
            <p className="text-lg text-gray-600 mb-8">{lang.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="px-5 py-2.5 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark transition-colors font-medium"
              >
                {lang.ctaEnroll}
              </Link>
              <a
                href="#curriculum"
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:border-brand-purple transition-colors"
              >
                {lang.ctaSyllabus}
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto pt-12 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* ── Quick facts ────────────────────────────────────────────── */}
          <Section title={lang.quickFacts.heading}>
            <div className="grid sm:grid-cols-2 gap-4">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <fact.icon className="h-5 w-5 shrink-0 text-brand-purple mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">{fact.label}</div>
                    <div className="font-medium text-gray-900">{fact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Overview ───────────────────────────────────────────────── */}
          <Section title={lang.overview.heading}>
            <div className="space-y-4 text-gray-700">
              {lang.overview.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Section>

          {/* ── Outcomes ───────────────────────────────────────────────── */}
          <Section title={lang.outcomes.heading}>
            <ul className="grid sm:grid-cols-2 gap-3">
              {lang.outcomes.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-gray-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-purple mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── Audience ───────────────────────────────────────────────── */}
          <Section title={lang.audience.heading}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-brand-purple">{lang.audience.forHeading}</h3>
                <ul className="space-y-3 text-gray-700">
                  {lang.audience.forItems.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-purple mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-gray-100 bg-brand-tint p-6">
                <h3 className="font-semibold mb-4 text-gray-700">{lang.audience.notForHeading}</h3>
                <ul className="space-y-3 text-gray-600">
                  {lang.audience.notForItems.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* ── Prerequisites ──────────────────────────────────────────── */}
          <Section title={lang.prerequisites.heading} note={lang.prerequisites.note}>
            <ul className="space-y-3 text-gray-700">
              {lang.prerequisites.items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Laptop className="h-5 w-5 shrink-0 text-brand-purple mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── Schedule ───────────────────────────────────────────────── */}
          <Section id="schedule" title={lang.schedule.heading} note={lang.schedule.note}>
            <div className="space-y-3">
              {lang.schedule.weeks.map((w) => (
                <div
                  key={w.week}
                  className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-purple/10 text-brand-purple">
                    <span className="text-[0.625rem] leading-none opacity-70">
                      {lang.schedule.weekLabel}
                    </span>
                    <span className="text-base font-bold leading-tight">{w.week}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{w.focus}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{w.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Curriculum ─────────────────────────────────────────────── */}
          <Section id="curriculum" title={lang.curriculum.heading} note={lang.curriculum.note}>
            <div className="space-y-3">
              {lang.curriculum.modules.map((m) => (
                <div
                  key={m.n}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-brand-purple/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-purple text-sm font-bold text-white">
                      {m.n}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-semibold text-gray-900">{m.title}</h3>
                        {/* Separate spans, not a "·" in the string: a middot
                            between two numbers gets reordered by bidi in RTL. */}
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{m.lessons}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span>{m.duration}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5">{m.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Capstone ───────────────────────────────────────────────── */}
          <Section>
            <div className="rounded-xl border border-brand-purple/30 bg-brand-purple/5 p-6">
              <div className="flex gap-3">
                <Rocket className="h-6 w-6 shrink-0 text-brand-purple" />
                <div>
                  <h2 className="text-xl font-bold mb-2">{lang.capstone.heading}</h2>
                  <p className="text-gray-700">{lang.capstone.desc}</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Includes ───────────────────────────────────────────────── */}
          <Section title={lang.includes.heading}>
            <ul className="grid sm:grid-cols-2 gap-3">
              {lang.includes.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-gray-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-purple mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── Tools ──────────────────────────────────────────────────── */}
          <Section title={lang.tools.heading} note={lang.tools.note}>
            <div className="flex flex-wrap gap-2">
              {lang.tools.items.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                >
                  <Wrench className="h-3.5 w-3.5 text-brand-purple" />
                  {tool}
                </span>
              ))}
            </div>
          </Section>

          {/* ── Instructor ─────────────────────────────────────────────── */}
          <Section title={lang.instructor.heading}>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src="/images/about-me.webp"
                  alt={lang.instructor.name}
                  className="h-28 w-28 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{lang.instructor.name}</h3>
                  <p className="text-sm text-brand-purple mb-3">{lang.instructor.role}</p>
                  <p className="text-gray-700 mb-4">{lang.instructor.bio}</p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                    {lang.instructor.points.map((p) => (
                      <li key={p} className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-brand-purple" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Pricing ────────────────────────────────────────────────── */}
          <Section id="pricing" title={lang.pricing.heading}>
            <div className="mb-6 rounded-xl border-2 border-brand-purple bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-brand-purple font-medium mb-1">
                    {lang.pricing.priceLabel}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{priceLabel}</div>
                </div>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark transition-colors font-medium"
                >
                  {lang.ctaEnroll}
                </Link>
              </div>
              <p className="flex items-start gap-2 text-sm text-gray-600 mt-4">
                <CreditCard className="h-4 w-4 shrink-0 text-brand-purple mt-0.5" />
                {lang.pricing.priceNote}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-brand-tint p-5">
              <h3 className="flex items-center gap-2 font-semibold mb-1.5">
                <ShieldCheck className="h-5 w-5 text-brand-purple" />
                {lang.pricing.guaranteeHeading}
              </h3>
              <p className="text-gray-700 text-sm">{lang.pricing.guarantee}</p>
            </div>
          </Section>

          {/* ── Enroll ─────────────────────────────────────────────────── */}
          <Section title={lang.enroll.heading}>
            <div className="space-y-4 mb-8">
              {lang.enroll.steps.map((step, idx) => (
                <div className="flex gap-4" key={step.title}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 font-bold text-brand-purple">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <Link
                to="/contact"
                className="inline-block px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark transition-colors font-medium"
              >
                {lang.enroll.cta}
              </Link>
              <p className="text-sm text-gray-500 mt-3">{lang.enroll.ctaNote}</p>
            </div>
          </Section>

          {/* ── FAQ ────────────────────────────────────────────────────── */}
          <Section title={lang.faq.heading}>
            <FaqAccordion
              items={lang.faq.items.map((f, idx) => ({
                id: idx,
                question: f.question,
                answer: f.answer,
              }))}
            />
          </Section>

          {/* ── Footer links ───────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-6 border-t border-gray-200 pt-8 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center text-brand-purple hover:underline"
            >
              {lang.allCourses}
            </Link>
            <Link to="/" className="inline-flex items-center text-brand-purple hover:underline">
              {isFa ? (
                <ArrowDown className="h-4 w-4 ml-1 transform -rotate-90" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1 transform rotate-90" />
              )}
              {lang.returnHome}
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default AiAgentCourse;
