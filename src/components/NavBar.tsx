"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import { clearLanguageCache } from "@/lib/cacheManager";
import { Link, useLocation, useNavigate } from "@/lib/router";
import { cn } from "@/lib/utils";
import { GlobalContext } from "./GlobalContext";

interface NavBarLang {
  home: string;
  about: string;
  aboutMe: string;
  services: string;
  blog: string;
  contact: string;
}

interface NavBarProps {
  lang: NavBarLang;
}

const getCurrentLang = () => {
  const stored = localStorage.getItem("selected_language");
  if (stored === "en") return "en";
  return "fa";
};

const setLangAndReload = (lang: "en" | "fa") => {
  const currentLang = getCurrentLang();
  if (currentLang !== lang) {
    // Clear language-specific cache when changing language
    clearLanguageCache();
  }

  localStorage.setItem("selected_language", lang);
  window.location.reload();
};

const NavBar: React.FC<NavBarProps> = ({ lang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { siteNameEn, siteNameFa, siteDescriptionEn, siteDescriptionFa, logo } =
    useContext(GlobalContext);
  const currentLang = getCurrentLang();
  const siteName = document.documentElement.dir === "rtl" ? siteNameFa : siteNameEn;
  const _siteDescription =
    document.documentElement.dir === "rtl" ? siteDescriptionFa : siteDescriptionEn;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      // Use React Router navigation with state
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent",
      )}
      dir={currentLang === "fa" ? "rtl" : "ltr"}
    >
      <div className="container flex items-center justify-between relative">
        {/* Desktop: Persian [menu][lang][logo], English [menu][lang][logo] (logo right, menu left) */}
        <div className="hidden md:flex w-full items-center justify-between">
          {currentLang === "fa" ? (
            <>
              {/* Menu (right) */}
              <div className="flex gap-6 items-center order-1">
                <Link to="/" className="text-gray-800 hover:text-brand-purple transition-colors">
                  {lang.home}
                </Link>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.about}
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.services}
                </button>
                <Link
                  to="/blog"
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.blog}
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.contact}
                </Link>
                {/* Language Switcher (next to Contact) */}
                <div className="flex items-center gap-1 select-none">
                  <button
                    className={`text-xl transition-colors ${(currentLang as string) === "en" ? "underline" : ""}`}
                    style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                    onClick={() => setLangAndReload("en")}
                    aria-label="Switch to English"
                    type="button"
                  >
                    🇺🇸
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    className={`text-xl transition-colors ${(currentLang as string) === "fa" ? "underline" : ""}`}
                    style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                    onClick={() => setLangAndReload("fa")}
                    aria-label="Switch to Persian"
                    type="button"
                  >
                    🇮🇷
                  </button>
                </div>
              </div>
              {/* Logo and site name (left) */}
              <Link to="/" className="flex items-center gap-2 font-bold order-2">
                <img
                  src="/images/linuxlogo.png"
                  alt="LinuxAcademy.ir Logo"
                  className="h-8 w-8 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] object-contain"
                  style={{ width: "2rem", height: "2rem" }}
                />
                <span className="text-xl">{siteName}</span>
              </Link>
            </>
          ) : (
            <>
              {/* Menu (left) */}
              <div className="flex gap-6 items-center order-1">
                <Link to="/" className="text-gray-800 hover:text-brand-purple transition-colors">
                  {lang.home}
                </Link>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.about}
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.services}
                </button>
                <Link
                  to="/blog"
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.blog}
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-800 hover:text-brand-purple transition-colors"
                >
                  {lang.contact}
                </Link>
                {/* Language Switcher (next to Contact) */}
                <div className="flex items-center gap-1 select-none">
                  <button
                    className={`text-xl transition-colors ${(currentLang as string) === "en" ? "underline" : ""}`}
                    style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                    onClick={() => setLangAndReload("en")}
                    aria-label="Switch to English"
                    type="button"
                  >
                    🇺🇸
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    className={`text-xl transition-colors ${(currentLang as string) === "fa" ? "underline" : ""}`}
                    style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                    onClick={() => setLangAndReload("fa")}
                    aria-label="Switch to Persian"
                    type="button"
                  >
                    🇮🇷
                  </button>
                </div>
              </div>
              {/* Logo and site name (right) */}
              <Link to="/" className="flex items-center gap-2 font-bold order-2 justify-end">
                <img
                  src="/images/linuxlogo.png"
                  alt="LinuxAcademy.ir Logo"
                  className="h-8 w-8 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] object-contain"
                  style={{ width: "2rem", height: "2rem" }}
                />
                <span className="text-xl">{siteName}</span>
              </Link>
            </>
          )}
        </div>
        {/* Mobile navbar for English */}
        {currentLang === "en" && (
          <div className="flex md:hidden w-full items-center justify-between relative">
            {/* Burger menu (left) */}
            <button className="p-2 order-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className="w-6 h-0.5 bg-navy mb-1.5"></div>
              <div className="w-6 h-0.5 bg-navy mb-1.5"></div>
              <div className="w-6 h-0.5 bg-navy"></div>
            </button>
            {/* Language Switcher (center) */}
            <div className="flex items-center gap-1 select-none order-2 flex-1 justify-center">
              <button
                className={`text-xl transition-colors ${(currentLang as string) === "en" ? "underline" : ""}`}
                style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                onClick={() => setLangAndReload("en")}
                aria-label="Switch to English"
                type="button"
              >
                🇺🇸
              </button>
              <span className="text-gray-400">|</span>
              <button
                className={`text-xl transition-colors ${(currentLang as string) === "fa" ? "underline" : ""}`}
                style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                onClick={() => setLangAndReload("fa")}
                aria-label="Switch to Persian"
                type="button"
              >
                🇮🇷
              </button>
            </div>
            {/* Logo and site name (right) */}
            <Link to="/" className="flex items-center gap-2 font-bold order-3">
              <img
                src="/images/linuxlogo.png"
                alt="LinuxAcademy.ir Logo"
                className="h-8 w-8 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] object-contain"
                style={{ width: "2rem", height: "2rem" }}
              />
              <span className="text-xl">{siteName}</span>
            </Link>
          </div>
        )}
        {/* Mobile navbar for Persian */}
        {currentLang === "fa" && (
          <div className="flex md:hidden w-full items-center justify-between flex-row-reverse relative">
            {/* Logo and site name (left, first in JSX, but right in row-reverse) */}
            <Link to="/" className="flex items-center gap-2 font-bold order-1">
              <img
                src="/images/linuxlogo.png"
                alt="LinuxAcademy.ir Logo"
                className="h-8 w-8 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] object-contain"
                style={{ width: "2rem", height: "2rem" }}
              />
              <span className="text-xl">{siteName}</span>
            </Link>
            {/* Language Switcher (center) */}
            <div className="flex items-center gap-1 select-none order-2 flex-1 justify-center">
              <button
                className={`text-xl transition-colors ${(currentLang as string) === "en" ? "underline" : ""}`}
                style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                onClick={() => setLangAndReload("en")}
                aria-label="Switch to English"
                type="button"
              >
                🇺🇸
              </button>
              <span className="text-gray-400">|</span>
              <button
                className={`text-xl transition-colors ${(currentLang as string) === "fa" ? "underline" : ""}`}
                style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                onClick={() => setLangAndReload("fa")}
                aria-label="Switch to Persian"
                type="button"
              >
                🇮🇷
              </button>
            </div>
            {/* Burger menu (right, last in JSX, but left in row-reverse) */}
            <button className="p-2 order-3" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className="w-6 h-0.5 bg-navy mb-1.5"></div>
              <div className="w-6 h-0.5 bg-navy mb-1.5"></div>
              <div className="w-6 h-0.5 bg-navy"></div>
            </button>
          </div>
        )}
        {/* Mobile menu (unchanged, but remove language switcher) */}
        {mobileMenuOpen && (
          <div
            className={`absolute top-full left-0 w-full bg-white shadow-md py-4 md:hidden animate-fade-in z-50${currentLang === "fa" ? " text-right" : ""}`}
            {...(currentLang === "fa" ? { dir: "rtl" } : {})}
          >
            <div
              className={
                currentLang === "fa"
                  ? "flex flex-col items-end w-full space-y-3 px-4"
                  : "flex flex-col space-y-3 px-4"
              }
            >
              <Link
                to="/"
                className={`${currentLang === "fa" ? "w-full text-right" : "text-left"} text-gray-800 hover:text-text-brand-purple transition-colors py-2`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang.home}
              </Link>
              <button
                onClick={() => scrollToSection("about")}
                className={`${currentLang === "fa" ? "w-full text-right" : "text-left"} text-gray-800 hover:text-brand-purple transition-colors py-2`}
              >
                {lang.aboutMe}
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className={`${currentLang === "fa" ? "w-full text-right" : "text-left"} text-gray-800 hover:text-brand-purple transition-colors py-2`}
              >
                {lang.services}
              </button>
              <Link
                to="/blog"
                className={`${currentLang === "fa" ? "w-full text-right" : "text-left"} text-gray-800 hover:text-brand-purple transition-colors py-2`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang.blog}
              </Link>
              <Link
                to="/contact"
                className={`${currentLang === "fa" ? "w-full text-right" : "text-left"} text-gray-800 hover:text-brand-purple transition-colors py-2`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang.contact}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
