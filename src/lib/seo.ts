// Shared SEO/AEO constants and JSON-LD helpers (server-side).

export const SITE_URL = "https://linuxacademy.ir";
export const SITE_NAME_FA = "لینوکس آکادمی";
export const SITE_NAME_EN = "Linux Academy";

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME_FA,
  alternateName: SITE_NAME_EN,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/images/linuxlogo.png` },
  description: "مشاوره، معماری و پیاده‌سازی دِواپس، زیرساخت ابری و هوش مصنوعی برای کسب‌وکارها.",
  areaServed: "IR",
  knowsAbout: ["DevOps", "Cloud Architecture", "Artificial Intelligence", "Linux"],
};

export function serviceJsonLd(opts: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: "fa",
    provider: { "@type": "Organization", name: SITE_NAME_FA, url: SITE_URL },
    areaServed: "IR",
  };
}

/**
 * schema.org/Course for a live, repeating online workshop. `byDay`/`startTime`
 * describe the weekly session, and the offer carries the enrollment price.
 */
export function courseJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  /** Total teaching hours, rendered as an ISO 8601 duration. */
  hours: number;
  sessions: number;
  /** Weekday the session runs, e.g. "Friday". */
  byDay: string;
  startTime: string;
  endTime: string;
  price: number;
  priceCurrency?: string;
  inLanguage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: opts.inLanguage ?? "fa",
    provider: { "@type": "Organization", name: SITE_NAME_FA, url: SITE_URL },
    educationalLevel: "Beginner to intermediate",
    teaches: opts.description,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${opts.hours}H`,
      repeatCount: opts.sessions,
      repeatFrequency: "weekly",
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1W",
        repeatCount: opts.sessions,
        byDay: `https://schema.org/${opts.byDay}`,
        startTime: opts.startTime,
        endTime: opts.endTime,
        scheduleTimezone: "Asia/Tehran",
      },
      instructor: { "@type": "Person", name: "Amir Mahdi Taleghani" },
    },
    offers: {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: opts.priceCurrency ?? "IRR",
      category: "Paid",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${opts.path}`,
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function webPageJsonLd(opts: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: "fa",
    isPartOf: { "@type": "WebSite", name: SITE_NAME_FA, url: SITE_URL },
  };
}
