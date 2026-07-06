"use client";

import moment from "moment-jalaali";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import BookingForm from "@/components/BookingForm";
import FaqAccordion from "@/components/FaqAccordion";
import { GlobalContext } from "@/components/GlobalContext";
import NavBar from "@/components/NavBar";
import ServiceCard from "@/components/ServiceCard";
import SponsorLogo from "@/components/SponsorLogo";
import { getArticles, getFaqs, getPositions, getSponsors } from "@/config/content";
import contactFormEn from "@/language/en/components/contactForm";
import navBarEn from "@/language/en/components/navBar";
import serviceCardEn from "@/language/en/components/serviceCard";
import enIndex from "@/language/en/index";
import homeEn from "@/language/en/pages/home";
import contactFormFa from "@/language/fa/components/contactForm";
import navBarFa from "@/language/fa/components/navBar";
import serviceCardFa from "@/language/fa/components/serviceCard";
import faIndex from "@/language/fa/index";
import homeFa from "@/language/fa/pages/home";
import { Link, useLocation, useNavigate } from "@/lib/router";
import { getStrapiMediaUrl } from "@/lib/utils";

// Language is resolved from the current text direction (fa = rtl), mirroring the
// rest of the pages, instead of being passed as a prop.
type IndexProps = Record<string, never>;

const COOKIE_CONSENT_KEY = "cookie_consent_accepted";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const isRTL = document.documentElement.dir === "rtl";

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-50 bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between px-4 py-3 shadow-lg animate-fade-in"
      dir={isRTL ? "rtl" : "ltr"}
      style={isRTL ? { fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif" } : {}}
    >
      <span className="mb-2 md:mb-0 text-sm">
        {isRTL
          ? "این سایت از کوکی‌ها برای بهبود تجربه شما استفاده می‌کند. با ادامه استفاده، شما با سیاست کوکی ما موافقت می‌کنید."
          : "This site uses cookies to enhance your experience. By continuing, you accept our cookie policy."}
      </span>
      <button
        onClick={acceptCookies}
        className={
          isRTL
            ? "md:mr-4 md:ml-0 px-5 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold text-sm transition-colors"
            : "ml-0 md:ml-4 px-5 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold text-sm transition-colors"
        }
      >
        {isRTL ? "قبول" : "Accept"}
      </button>
    </div>
  );
};

const Index: React.FC<IndexProps> = () => {
  const language: any = document.documentElement.dir === "rtl" ? faIndex : enIndex;
  const [isVisible, setIsVisible] = useState(false);
  const [sponsors, setSponsors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [_about, _setAbout] = useState("");
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState(false);
  const { hourlyRate, heroImage, aboutImage } = useContext(GlobalContext);
  const serviceCardLang = document.documentElement.dir === "rtl" ? serviceCardFa : serviceCardEn;
  const navBarLang = document.documentElement.dir === "rtl" ? navBarFa : navBarEn;
  const _contactFormLang = document.documentElement.dir === "rtl" ? contactFormFa : contactFormEn;
  const homeLang = document.documentElement.dir === "rtl" ? homeFa : homeEn;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Content is static now (no Strapi).
    setArticles(getArticles() as any);
    setFaqs(getFaqs() as any);
    setSponsors(getSponsors() as any);
    setPositions(getPositions() as any);
    setLoading(false);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      let attempts = 0;
      const maxAttempts = 20; // 20 * 50ms = 1s
      const pollForElementAndScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          // Clear the state so it doesn't scroll again on next render
          navigate(".", { replace: true, state: {} });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(pollForElementAndScroll, 50);
        } else {
          // Give up after 1s
          navigate(".", { replace: true, state: {} });
        }
      };
      pollForElementAndScroll();
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <NavBar lang={navBarLang} />
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری اطلاعات</h2>
          <p className="text-gray-700 mb-6">
            متاسفانه ارتباط با سرور برقرار نشد. لطفاً بعداً دوباره تلاش کنید.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar lang={navBarLang} />
        {/* Hero Section Skeleton */}
        <section className="pt-24 md:pt-32 pb-16 md:pb-32 relative bg-white animate-pulse">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="flex gap-4 mt-6">
                <div className="h-10 w-32 bg-gray-200 rounded" />
                <div className="h-10 w-32 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="relative">
              <div className="h-64 bg-gray-200 rounded-lg w-full" />
            </div>
          </div>
        </section>
        {/* Booking Section Skeleton */}
        <section className="pt-0 pb-16 bg-[#FAFAFF] animate-pulse">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-8" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            </div>
          </div>
        </section>
        {/* About Section Skeleton */}
        <section className="py-16 bg-white animate-pulse">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-8" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
            <div>
              <div className="h-64 bg-gray-200 rounded-lg w-full" />
            </div>
          </div>
        </section>
        {/* Experience Section Skeleton */}
        <section className="py-16 bg-[#FAFAFF] animate-pulse">
          <div className="container">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center"
                >
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <div className="h-10 w-40 bg-gray-200 rounded mx-auto" />
            </div>
          </div>
        </section>
        {/* Sponsors Section Skeleton */}
        <section className="py-16 bg-[#FAFAFF] animate-pulse">
          <div className="container">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
            <div className="flex gap-6 justify-center items-center">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="h-24 w-40 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section Skeleton */}
        <section className="py-16 bg-white animate-pulse">
          <div className="container">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
            <div className="max-w-3xl mx-auto space-y-4">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="mb-4">
                  <div className="h-12 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Blog Section Skeleton */}
        <section className="py-16 bg-[#FAFAFF] animate-pulse">
          <div className="container">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="blog-card shadow-md bg-white rounded-lg overflow-hidden">
                  <div className="relative overflow-hidden h-48 bg-gray-200 animate-pulse" />
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <div className="h-10 w-40 bg-gray-200 rounded mx-auto" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div>
        <NavBar lang={navBarLang} />
        {/* Hero Section with Booking Form Overlay */}
        <section id="home" className="pt-24 md:pt-32 pb-16 md:pb-32 relative bg-white">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div
              className={`space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.1s",
              }}
            >
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {(() => {
                  const devops = language.hero.devops;
                  const cloud = language.hero.cloud;
                  const ai = language.hero.ai;
                  const colorMap: Record<string, string> = {
                    [devops]: "#8B5CF6",
                    [cloud]: "#D946EF",
                    [ai]: "", // will use class for AI
                  };
                  const aiClass = "text-brand-cyan";
                  const splitRegex = new RegExp(`(${devops}|${cloud}|${ai})`, "g");
                  return language.hero.title.split(splitRegex).map((part, i) => {
                    if (part === devops)
                      return (
                        <span key={i} style={{ color: colorMap[devops] }}>
                          {devops}
                        </span>
                      );
                    if (part === cloud)
                      return (
                        <span key={i} style={{ color: colorMap[cloud] }}>
                          {cloud}
                        </span>
                      );
                    if (part === ai)
                      return (
                        <span key={i} className={aiClass}>
                          {ai}
                        </span>
                      );
                    return part;
                  });
                })()}
              </h1>
              <p className="text-gray-600">{homeLang.hero.description}</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      // Mobile: scroll to the top of the form, then offset for negative margin
                      const form = document.getElementById("booking-form-container");
                      if (form) {
                        form.scrollIntoView({
                          behavior: "smooth",
                        });
                        setTimeout(() => {
                          window.scrollBy({
                            top: -64,
                            left: 0,
                            behavior: "smooth",
                          }); // adjust -64 as needed for your margin
                        }, 400); // allow scrollIntoView to finish
                      }
                    } else {
                      // Desktop: scroll to the section anchor as before
                      const anchor = document.getElementById("booking-anchor");
                      if (anchor) {
                        anchor.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-md text-brand-purple transition-colors duration-200 hover:border-brand-purple hover:text-brand-purple"
                >
                  {homeLang.hero.bookNow}
                </button>
                <a
                  href="https://youtube.com/@linuxacademyir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white border border-gray-300 rounded-md text-red-600 transition-colors duration-200 hover:border-red-600 hover:text-red-600 flex items-center"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  {homeLang.hero.youtube}
                </a>
              </div>
            </div>

            <div
              className={`relative ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.3s",
              }}
            >
              <div className="relative">
                <img
                  src={heroImage || "/images/hero-me.webp"}
                  alt="Professional Consultant"
                  className="rounded-lg object-cover w-full aspect-square md:aspect-auto md:h-[500px]"
                />
                <div
                  className={`absolute -bottom-5 ${document.documentElement.dir === "rtl" ? "-left-5" : "-right-5"} bg-gradient-to-br from-brand-magenta/80 to-brand-purple/80 backdrop-blur-sm p-4 rounded-lg max-w-xs hidden md:block`}
                >
                  <p className="text-white font-medium">"{homeLang.hero.quote}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Anchor point for the Book Now button */}
          <div id="booking-anchor" className="h-0"></div>
        </section>

        {/* Booking Section */}
        <section id="book" className="pt-0 pb-16 bg-[#FAFAFF]">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div
              id="booking-form-container"
              className={`order-2 md:order-1 -mt-8 md:-mt-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.1s",
              }}
            >
              <BookingForm />
            </div>

            <div
              className={`mb-12 order-1 md:order-2 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.3s",
              }}
            >
              <div className="text-xs font-normal text-black mb-2">
                {homeLang.booking.sectionTitle}
              </div>
              <h2
                className={`title-modern mb-8 ${document.documentElement.dir === "rtl" ? "text-right" : "text-left"}`}
              >
                {homeLang.booking.heading}
              </h2>
              <p className="text-gray-600">{homeLang.booking.description}</p>

              <div className="space-y-2">
                {homeLang.booking.steps.map((step, idx) => (
                  <div
                    className={`flex items-center gap-3${document.documentElement.dir === "rtl" && idx === 0 ? " mt-6" : ""}`}
                    key={idx}
                  >
                    <div
                      className="p-2 rounded-md"
                      style={{
                        color: idx === 0 ? "#8B5CF6" : idx === 1 ? "#D946EF" : "#06B6D4",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">{step}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div
              className={`mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-xs font-normal text-black mb-2">
                {language.about.sectionTitle}
              </div>
              <h2
                className={`title-modern mb-8 ${document.documentElement.dir === "rtl" ? "text-right" : "text-left"}`}
              >
                {language.about.heading}
              </h2>
              {/* Render each paragraph separately */}
              {language.about.paragraphs.map((p, i) => (
                <p className="text-gray-600 max-w-2xl mt-8" key={i}>
                  {p}
                </p>
              ))}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {language.about.stats.map((stat, i) => (
                  <div className="space-y-2" key={i}>
                    <h4 className="font-bold text-xl" style={{ color: stat.color }}>
                      {stat.value}
                    </h4>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.3s" }}
            >
              <img
                src={aboutImage || "/images/about-me.webp"}
                alt="Consultant at work"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16 bg-[#FAFAFF]">
          <div className="container">
            <div
              className={`text-center max-w-xl mx-auto mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.1s",
              }}
            >
              <div className="text-xs font-normal text-black mb-2">
                {language.experience.sectionTitle}
              </div>
              <h2 className="title-modern center-title mb-8 mx-auto">
                {language.experience.heading}
              </h2>
              <p className="text-gray-600 mt-8">{language.experience.description} </p>
            </div>

            <div
              className={`grid md:grid-cols-3 gap-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.3s" }}
            >
              {positions.map((position, index) => {
                // Cycle through colors for consistency
                const colorIndex = index % 3;
                const colorClass =
                  colorIndex === 0
                    ? "text-brand-purple"
                    : colorIndex === 1
                      ? "text-brand-magenta"
                      : "text-brand-cyan";
                return (
                  <a
                    key={position.id}
                    href={position.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center"
                  >
                    <h3 className={`text-lg font-semibold mb-2 ${colorClass} text-center`}>
                      {position.position}
                    </h3>
                    <p
                      className="text-brand-black font-bold mb-3 text-center"
                      style={
                        document.documentElement.dir === "ltr"
                          ? {
                              fontFamily: "'Alibaba Sans', 'Segoe UI', 'Arial', sans-serif",
                              fontWeight: 700,
                            }
                          : {}
                      }
                    >
                      {position.companyName}
                    </p>
                    <p className="text-gray-600 text-sm text-center">{position.description}</p>
                  </a>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/contact"
                className="bg-brand-magenta px-6 py-3 border border-brand-magenta text-white rounded-md hover:bg-brand-magenta/90 hover:border-brand-magenta transition-colors"
              >
                {language.experience.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 bg-white">
          <div className="container">
            <div
              className={`text-center max-w-xl mx-auto mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.1s",
              }}
            >
              <div className="text-xs font-normal text-black mb-2">
                {language.services.sectionTitle}
              </div>
              <h2 className="title-modern center-title mb-8 mx-auto">
                {language.services.heading}
              </h2>
              <p className="text-gray-600 mt-8">{language.services.description} </p>
            </div>
            <div
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.3s",
              }}
            >
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
        </section>

        {/* Sponsors Section  */}
        <section className="py-16 bg-[#FAFAFF]">
          <div className="container">
            <div
              className={`text-center max-w-xl mx-auto mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.1s",
              }}
            >
              <div className="text-xs font-normal text-black mb-2">
                {language.sponsors.sectionTitle}
              </div>
              <h2 className="title-modern center-title mb-8 mx-auto">
                {language.sponsors.heading}
              </h2>
              <p className="text-gray-600 mt-8">{language.sponsors.description}</p>
            </div>
            <style>{`
              .marquee-container {
                overflow: hidden;
                position: relative;
                width: 100%;
                height: 160px;
                margin: 0 auto;
              }
              .marquee-row {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                width: max-content;
                animation: marquee-ltr 30s linear infinite;
              }
              [dir='rtl'] .marquee-row {
                animation-name: marquee-rtl;
              }
              @keyframes marquee-ltr {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes marquee-rtl {
                0% { transform: translateX(0); }
                100% { transform: translateX(50%); }
              }
            `}</style>
            <div className="marquee-container">
              <div className="marquee-row">
                {[...sponsors, ...sponsors].map((sponsor, idx) => (
                  <a
                    key={`${sponsor.id}-${idx}`}
                    href={sponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[180px] max-w-[220px] flex-shrink-0"
                  >
                    <SponsorLogo name={sponsor.name} imgSrc={sponsor.logo} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white">
          <div className="container">
            <div
              className={`text-center max-w-xl mx-auto mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-xs font-normal text-black mb-2">{language.faq.sectionTitle}</div>
              <h2 className="title-modern center-title mb-8 mx-auto">{language.faq.heading}</h2>
              <p className="text-gray-600 mt-8">{language.faq.description}</p>
            </div>

            <div
              className={`max-w-3xl mx-auto ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.3s" }}
            >
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>

        {/* Blog Section - Updated to show latest articles */}
        <section id="blog" className="py-16 bg-[#FAFAFF]">
          <div className="container">
            <div
              className={`text-center max-w-xl mx-auto mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.1s",
              }}
            >
              <div className="text-xs font-normal text-black mb-2">
                {language.blog.sectionTitle}
              </div>
              <h2 className="title-modern center-title mb-8 mx-auto">{language.blog.heading}</h2>
              <p className="text-gray-600 max-w-2xl mt-8 ">{language.blog.description}</p>
            </div>

            <div
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8  ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.3s" }}
            >
              {articles.map((post, index) => {
                // Cycle through colors for consistency
                const colorIndex = index % 3;
                const colorClass =
                  colorIndex === 0
                    ? "bg-brand-purple"
                    : colorIndex === 1
                      ? "bg-brand-magenta"
                      : "bg-brand-cyan";

                return (
                  <div key={post.id} className="blog-card shadow-md bg-white ">
                    <Link to={`/blog/${post.slug}`} className="relative overflow-hidden block">
                      <img
                        src={getStrapiMediaUrl(post.cover?.url)}
                        alt={post.title}
                        className="blog-card-image cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-3 left-3 ${colorClass} text-white text-xs px-2 py-1 rounded-md`}
                      >
                        {document.documentElement.dir === "rtl"
                          ? moment(post.publishedAt).format("jYYYY/jMM/jDD")
                          : new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </Link>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2 transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.summary}</p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className={`text-${colorIndex === 0 ? "brand-purple" : colorIndex === 1 ? "brand-magenta" : "brand-cyan"} font-medium text-sm flex items-center`}
                      >
                        {language.blog.readMore}
                        {document.documentElement.dir === "rtl" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/blog"
                className="bg-white px-6 py-3 border border-brand-purple text-brand-purple rounded-md hover:bg-brand-purple/5 transition-colors font-medium"
              >
                {language.blog.viewAll}
              </Link>
            </div>
          </div>
        </section>
      </div>
      <CookieConsent />
    </div>
  );
};

export default Index;
