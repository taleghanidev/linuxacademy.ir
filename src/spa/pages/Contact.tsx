"use client";

import { useEffect } from "react";
import BookingForm from "@/components/BookingForm";
import ContactInfo from "@/components/ContactForm";
import PageShell, { useIsFa } from "@/components/PageShell";
import bookingFormEn from "@/language/en/components/bookingForm";
import contactFormEn from "@/language/en/components/contactForm";
import footerCardEn from "@/language/en/components/footerCard";
import contactPageEn from "@/language/en/pages/contact";
import bookingFormFa from "@/language/fa/components/bookingForm";
import contactFormFa from "@/language/fa/components/contactForm";
import footerCardFa from "@/language/fa/components/footerCard";
import contactPageFa from "@/language/fa/pages/contact";

const Contact = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const isFa = useIsFa();
  const contactFormLang = isFa ? contactFormFa : contactFormEn;
  const contactPageLang = isFa ? contactPageFa : contactPageEn;
  const bookingFormLang = isFa ? bookingFormFa : bookingFormEn;
  const _footerCardLang = isFa ? footerCardFa : footerCardEn;

  return (
    <PageShell>
      <h1 className="text-4xl font-bold mb-6 text-center">{contactPageLang.contactUs}</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{contactPageLang.intro}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Booking Form */}
        <div>
          <BookingForm lang={bookingFormLang} />
        </div>
        {/* Contact Information */}
        <div className="flex flex-col gap-6">
          {/* Description Box */}
          <div className="border border-gray-200 bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-0">{contactPageLang.desc}</p>
          </div>
          {/* Get In Touch Box */}
          <div className="border border-gray-200 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">{contactPageLang.getInTouch}</h2>
            <ContactInfo lang={contactFormLang} />
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Contact;
