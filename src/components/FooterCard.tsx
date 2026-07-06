"use client";

import { useContext } from "react";
import ContactInfo from "@/components/ContactForm";
import { GlobalContext } from "@/components/GlobalContext";
import contactFormEn from "@/language/en/components/contactForm";
import footerCardEn from "@/language/en/components/footerCard";
import contactFormFa from "@/language/fa/components/contactForm";
import footerCardFa from "@/language/fa/components/footerCard";
import { Link } from "@/lib/router";

interface FooterCardLang {
  description: string;
  services: string;
  consult: string;
  architect: string;
  implement: string;
  legal: string;
  privacyPolicy: string;
  termsOfService: string;
  sponsorship: string;
  contact: string;
  copyright: string;
}

interface FooterCardProps {
  lang?: FooterCardLang;
}

const FooterCard = ({ lang }: FooterCardProps) => {
  const { siteNameEn, siteNameFa, siteDescriptionEn, siteDescriptionFa, logo } =
    useContext(GlobalContext);
  const isRtl = typeof window !== "undefined" ? document.documentElement.dir === "rtl" : false;
  const siteName = isRtl ? siteNameFa : siteNameEn;
  const siteDescription = isRtl ? siteDescriptionFa : siteDescriptionEn;
  const language = lang || (document.documentElement.dir === "rtl" ? footerCardFa : footerCardEn);
  const contactFormLang = document.documentElement.dir === "rtl" ? contactFormFa : contactFormEn;
  return (
    <footer className="text-black py-4 bg-white border-t">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img
                src="/images/linuxlogo.png"
                alt="LinuxAcademy.ir Logo"
                className="h-10 w-10 min-w-[2.5rem] min-h-[2.5rem] max-w-[2.5rem] max-h-[2.5rem] object-contain"
                style={{ width: "2.5rem", height: "2.5rem" }}
              />
              <h3 className="text-xl font-bold">{siteName}</h3>
            </div>
            <p className="text-black">{siteDescription}</p>
            {typeof window !== "undefined" && document.documentElement.dir === "rtl" && (
              <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=619073&Code=tJ0ShjpdK5AcZ24CcexBPzx0Zk4p4LR5"
                rel="noopener noreferrer"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=619073&Code=tJ0ShjpdK5AcZ24CcexBPzx0Zk4p4LR5"
                  alt="enamad"
                  loading="lazy"
                  style={{ cursor: "pointer" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  {...({ code: "tJ0ShjpdK5AcZ24CcexBPzx0Zk4p4LR5" } as any)}
                />
              </a>
            )}
          </div>

          {/* Services Section */}
          <div className="space-y-2">
            <h4 className="font-semibold mb-4">{language.services}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services-consult"
                  className="text-gray-600 hover:text-brand-purple transition-colors"
                >
                  {language.consult}
                </Link>
              </li>
              <li>
                <Link
                  to="/services-architect"
                  className="text-gray-600 hover:text-brand-purple transition-colors"
                >
                  {language.architect}
                </Link>
              </li>
              <li>
                <Link
                  to="/services-implement"
                  className="text-gray-600 hover:text-brand-purple transition-colors"
                >
                  {language.implement}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-2">
            <h4 className="font-semibold mb-4">{language.legal}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-600 hover:text-brand-purple transition-colors"
                >
                  {language.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-600 hover:text-brand-purple transition-colors"
                >
                  {language.termsOfService}
                </Link>
              </li>
              <li>
                <Link
                  to="/sponsor"
                  className="text-gray-600 hover:text-brand-purple transition-colors"
                >
                  {language.sponsorship}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 md:col-span-1">
            <h4 className="font-semibold mb-1">{language.contact}</h4>
            <ContactInfo lang={contactFormLang} />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-4">
          <p className="text-gray-600">{language.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterCard;
