"use client";

import { ArrowDown, ArrowRight, Users } from "lucide-react";
import PageShell, { useIsFa } from "@/components/PageShell";
import coursesEn from "@/language/en/pages/courses";
import coursesFa from "@/language/fa/pages/courses";
import { Link } from "@/lib/router";

const Courses = () => {
  const isFa = useIsFa();
  const lang = isFa ? coursesFa : coursesEn;

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{lang.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{lang.intro}</p>
        <p className="text-gray-700 mb-10">{lang.description}</p>

        <h2 className="text-2xl font-bold mb-6">{lang.availableHeading}</h2>
        <div className="space-y-4 mb-12">
          {lang.cards.map((card) => (
            <Link
              key={card.slug}
              to={card.linkUrl}
              className="block rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-brand-purple/50"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  {card.meta.map((bit, i) => (
                    <span key={bit} className="flex items-center gap-2">
                      {i > 0 && <span className="h-1 w-1 rounded-full bg-gray-300" />}
                      {bit}
                    </span>
                  ))}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-purple">
                  {lang.viewCourse}
                  <ArrowRight className={`h-4 w-4 ${isFa ? "rotate-180" : ""}`} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-gray-100 bg-brand-tint p-6 mb-12">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
            <Users className="h-5 w-5 text-brand-purple" />
            {lang.customHeading}
          </h2>
          <p className="text-gray-700 mb-4">{lang.customDesc}</p>
          <Link
            to="/contact"
            className="inline-block px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark transition-colors"
          >
            {lang.customCta}
          </Link>
        </div>

        <div className="text-center">
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
    </PageShell>
  );
};

export default Courses;
