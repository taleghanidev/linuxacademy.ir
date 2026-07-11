import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getArticleBySlug, getArticles } from "@/config/content";
import { SITE_URL } from "@/lib/seo";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  return getArticles("fa").map((a) => ({ slug: a.slug }));
}

// Very light markdown → plain text for schema.org articleBody.
function mdToText(md: string) {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\|/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fa = getArticleBySlug(slug, "fa");
  if (!fa) return { title: "مقاله | لینوکس آکادمی" };
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: `${fa.title} | لینوکس آکادمی`,
    description: fa.summary,
    alternates: {
      canonical: url,
      types: { "text/markdown": `${url}.md` },
    },
    openGraph: {
      title: fa.title,
      description: fa.summary,
      url,
      type: "article",
      locale: "fa_IR",
      siteName: "لینوکس آکادمی",
      publishedTime: fa.publishedAt,
      modifiedTime: fa.updatedAt ?? fa.publishedAt,
      images: [{ url: `${SITE_URL}${fa.cover.url}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fa.title,
      description: fa.summary,
    },
  };
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fa = getArticleBySlug(slug, "fa");
  const url = `${SITE_URL}/blog/${slug}`;

  const jsonLd: object[] = [];
  if (fa) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: fa.title,
      description: fa.summary,
      inLanguage: "fa",
      datePublished: fa.publishedAt,
      dateModified: fa.updatedAt ?? fa.publishedAt,
      image: `${SITE_URL}${fa.cover.url}`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: {
        "@type": "Organization",
        name: "لینوکس آکادمی",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "لینوکس آکادمی",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/images/linuxlogo.png` },
      },
      articleBody: mdToText(fa.content),
    });
    if (fa.faq?.length) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: "fa",
        mainEntity: fa.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogPostClient />
    </>
  );
}
