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
