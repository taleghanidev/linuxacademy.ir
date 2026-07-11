import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getArticles } from "@/config/content";
import { SITE_URL } from "@/lib/seo";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "بلاگ | لینوکس آکادمی — دِواپس، زیرساخت ابری و هوش مصنوعی",
  description:
    "مقالات تخصصی دِواپس، معماری ابری و هوش مصنوعی برای کسب‌وکارها؛ راهنمای عملی از تیم مشاوره لینوکس آکادمی.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "بلاگ لینوکس آکادمی",
    description: "مقالات تخصصی دِواپس، معماری ابری و هوش مصنوعی برای کسب‌وکارها.",
    url: `${SITE_URL}/blog`,
    type: "website",
    locale: "fa_IR",
    siteName: "لینوکس آکادمی",
  },
};

export default function Route() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "بلاگ لینوکس آکادمی",
    url: `${SITE_URL}/blog`,
    inLanguage: "fa",
    blogPost: getArticles("fa").map((a) => ({
      "@type": "TechArticle",
      headline: a.title,
      url: `${SITE_URL}/blog/${a.slug}`,
      datePublished: a.publishedAt,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogListClient />
    </>
  );
}
