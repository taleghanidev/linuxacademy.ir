"use client";

import { ArrowDown } from "lucide-react";
import NavBar from "@/components/NavBar";
import ServiceCard from "@/components/ServiceCard";
import navBarEn from "@/language/en/components/navBar";
import serviceCardEn from "@/language/en/components/serviceCard";
import servicesArchitectEn from "@/language/en/pages/servicesArchitect";
import navBarFa from "@/language/fa/components/navBar";
import serviceCardFa from "@/language/fa/components/serviceCard";
import servicesArchitectFa from "@/language/fa/pages/servicesArchitect";
import { Link } from "@/lib/router";

const ServicesArchitect = () => {
  const lang = document.documentElement.dir === "rtl" ? servicesArchitectFa : servicesArchitectEn;
  const serviceCardLang = document.documentElement.dir === "rtl" ? serviceCardFa : serviceCardEn;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={document.documentElement.dir === "rtl" ? navBarFa : navBarEn} />

      <div className="container mx-auto pt-24 pb-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{lang.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{lang.intro}</p>

          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-8">
            <div className="h-64 overflow-hidden">
              <img
                src="/images/architect.webp"
                alt={lang.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">{lang.intro}</p>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{lang.designProcess.title}</h2>
                <div className="space-y-4">
                  {lang.designProcess.steps.map((step, idx) => (
                    <div className="flex" key={idx}>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-magenta/10 flex items-center justify-center text-brand-magenta font-bold">
                        {idx + 1}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{lang.servicesInclude.title}</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {lang.servicesInclude.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">{lang.cta.title}</h3>
                <p className="text-gray-600 mb-4">{lang.cta.desc}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="px-4 py-2 bg-brand-magenta text-white rounded-md hover:bg-brand-magenta-dark transition-colors"
                  >
                    {lang.cta.book}
                  </Link>
                  <Link
                    to="/services-implement"
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:border-brand-magenta transition-colors"
                  >
                    {lang.cta.explore}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* All Services Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{lang.allServices}</h2>
            <div className="grid md:grid-cols-3 gap-6 bg-white rounded-lg overflow-hidden shadow-md mb-8 ">
              <ServiceCard
                title={serviceCardLang.consult}
                description={serviceCardLang.consultDesc}
                linkUrl="/services-consult"
                serviceCardLang={serviceCardLang}
              />
              <ServiceCard
                title={serviceCardLang.architect}
                description={serviceCardLang.architectDesc}
                linkUrl="/services-architect"
                serviceCardLang={serviceCardLang}
              />
              <ServiceCard
                title={serviceCardLang.implement}
                description={serviceCardLang.implementDesc}
                linkUrl="/services-implement"
                serviceCardLang={serviceCardLang}
              />
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-brand-magenta hover:underline">
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
export default ServicesArchitect;
