"use client";

import { ArrowDown } from "lucide-react";
import NavBar from "@/components/NavBar";
import ServiceCard from "@/components/ServiceCard";
import navBarEn from "@/language/en/components/navBar";
import serviceCardEn from "@/language/en/components/serviceCard";
import servicesImplementEn from "@/language/en/pages/servicesImplement";
import navBarFa from "@/language/fa/components/navBar";
import serviceCardFa from "@/language/fa/components/serviceCard";
import servicesImplementFa from "@/language/fa/pages/servicesImplement";
import { Link } from "@/lib/router";

const ServicesImplement = () => {
  // Force lang to any to allow for different i18n object shapes
  const lang: any =
    document.documentElement.dir === "rtl" ? servicesImplementFa : servicesImplementEn;
  const serviceCardLang = document.documentElement.dir === "rtl" ? serviceCardFa : serviceCardEn;
  const isFa = document.documentElement.dir === "rtl";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={isFa ? navBarFa : navBarEn} />

      <div className="container mx-auto pt-24 pb-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{lang.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{lang.intro}</p>

          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-8">
            <div className="h-64 overflow-hidden">
              <img
                src="/images/implement.webp"
                alt={lang.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="p-6">
              {/* Methodology Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {isFa ? lang.methodology.title : lang.sections[1].heading}
                </h2>
                <div className="space-y-4">
                  {isFa
                    ? lang.methodology.steps.map((step, idx) => (
                        <div className="flex" key={idx}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-bold">
                            {idx + 1}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                            <p className="text-gray-600">{step.desc}</p>
                          </div>
                        </div>
                      ))
                    : [
                        <div className="flex" key={1}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-bold">
                            1
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Planning & Setup</h3>
                            <p className="text-gray-600">
                              Detailed implementation planning and environment preparation
                            </p>
                          </div>
                        </div>,
                        <div className="flex" key={2}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-bold">
                            2
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Development & Configuration
                            </h3>
                            <p className="text-gray-600">
                              Building, configuring and customizing solutions according to
                              specifications
                            </p>
                          </div>
                        </div>,
                        <div className="flex" key={3}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-bold">
                            3
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Testing & Quality Assurance
                            </h3>
                            <p className="text-gray-600">
                              Rigorous testing to ensure functionality, performance, and security
                            </p>
                          </div>
                        </div>,
                        <div className="flex" key={4}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-bold">
                            4
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Deployment & Knowledge Transfer
                            </h3>
                            <p className="text-gray-600">
                              Smooth deployment and comprehensive documentation and training
                            </p>
                          </div>
                        </div>,
                      ]}
                </div>
              </div>
              {/* Services Include Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {isFa ? lang.servicesInclude.title : "Implementation Services Include"}
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {isFa
                    ? lang.servicesInclude.items.map((item, idx) => <li key={idx}>{item}</li>)
                    : [
                        <li key={1}>Cloud infrastructure implementation (AWS, Azure, GCP)</li>,
                        <li key={2}>DevOps pipeline setup and automation</li>,
                        <li key={3}>
                          Container orchestration implementation (Kubernetes, Docker Swarm)
                        </li>,
                        <li key={4}>Microservices deployment and management</li>,
                        <li key={5}>Monitoring and observability systems setup</li>,
                        <li key={6}>AI/ML model deployment and operationalization</li>,
                        <li key={7}>Security implementation and hardening</li>,
                        <li key={8}>Data pipeline and analytics implementation</li>,
                      ]}
                </ul>
              </div>
              {/* CTA Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">
                  {isFa ? lang.cta.title : lang.sections[2].heading}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isFa ? lang.cta.desc : lang.sections[2].content}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="px-4 py-2 bg-brand-cyan text-white rounded-md hover:bg-brand-cyan-dark transition-colors"
                  >
                    {isFa ? lang.cta.book : lang.contactCta}
                  </Link>
                  <Link
                    to="/services-consult"
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:border-brand-cyan transition-colors"
                  >
                    {isFa ? lang.cta.explore : serviceCardLang.consult}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* All Services Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{lang.allServices}</h2>
            <div className="grid md:grid-cols-3 gap-6 bg-white rounded-lg overflow-hidden shadow-md mb-8">
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
            <Link to="/" className="inline-flex items-center text-brand-cyan hover:underline">
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

export default ServicesImplement;
