import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getFaqs } from "@/config/content";
import { ORGANIZATION_JSONLD, SITE_NAME_FA, SITE_URL } from "@/lib/seo";
import { HomeClient } from "./spa-clients";

export const metadata: Metadata = {
  title: `${SITE_NAME_FA} | مشاوره دِواپس، زیرساخت ابری و هوش مصنوعی`,
  description:
    "لینوکس آکادمی خدمات مشاوره، معماری و پیاده‌سازی دِواپس، زیرساخت ابری و هوش مصنوعی ارائه می‌دهد؛ جلسه مشاوره را آنلاین رزرو کنید و هزینه را پیش از پرداخت شفاف ببینید.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME_FA} | مشاوره دِواپس، ابر و هوش مصنوعی`,
    description: "مشاوره، معماری و پیاده‌سازی دِواپس، زیرساخت ابری و هوش مصنوعی برای کسب‌وکارها.",
    url: SITE_URL,
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME_FA,
  },
};

export default function Route() {
  const jsonLd = [
    ORGANIZATION_JSONLD,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME_FA,
      alternateName: "Linux Academy",
      url: SITE_URL,
      inLanguage: ["fa", "en"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "fa",
      mainEntity: getFaqs("fa").map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeClient />
    </>
  );
}
