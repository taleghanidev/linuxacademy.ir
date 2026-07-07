"use client";

import { ArrowDown } from "lucide-react";
import PageShell, { useIsFa } from "@/components/PageShell";
import privacyPolicyEn from "@/language/en/pages/privacyPolicy";
import privacyPolicyFa from "@/language/fa/pages/privacyPolicy";
import { Link } from "@/lib/router";

const PrivacyPolicy = () => {
  const isFa = useIsFa();
  const lang = isFa ? privacyPolicyFa : privacyPolicyEn;

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{lang.title}</h1>
        <div className="prose bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {lang.sections.map((section, idx) => (
            <div key={idx}>
              <h2>{section.heading}</h2>
              {Array.isArray(section.content) ? (
                <ul>
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-8">{lang.lastUpdated}</p>
        </div>
        <div className="text-center mt-8">
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

export default PrivacyPolicy;
