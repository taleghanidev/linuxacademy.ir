"use client";

import { ArrowDown } from "lucide-react";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import navBarEn from "@/language/en/components/navBar";
import privacyPolicyEn from "@/language/en/pages/privacyPolicy";
import navBarFa from "@/language/fa/components/navBar";
import privacyPolicyFa from "@/language/fa/pages/privacyPolicy";
import { Link } from "@/lib/router";

const PrivacyPolicy = () => {
  useEffect(() => {
    // Force RTL if not already set and user is on Persian
    if (
      window.location.pathname.startsWith("/fa") ||
      document.documentElement.lang === "fa" ||
      document.documentElement.dir === "rtl"
    ) {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "fa";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, []);

  const lang = document.documentElement.dir === "rtl" ? privacyPolicyFa : privacyPolicyEn;
  const navLang = document.documentElement.dir === "rtl" ? navBarFa : navBarEn;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={navLang} />
      <div className="container mx-auto pt-24 pb-4">
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
              {document.documentElement.dir === "rtl" ? (
                <ArrowDown className="h-4 w-4 ml-1 transform -rotate-90" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1 transform rotate-90" />
              )}
              {lang.returnHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
