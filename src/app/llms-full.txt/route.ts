import { getArticles, getFaqs } from "@/config/content";
import { SITE_URL } from "@/lib/seo";

// /llms-full.txt — full site content for AI crawlers and agents (llmstxt.org convention).
export const dynamic = "force-static";

export function GET() {
  const sections: string[] = [
    "# لینوکس آکادمی (Linux Academy) — Full content for LLMs",
    "",
    "> Persian-language (Farsi) consulting firm for DevOps, cloud infrastructure, and AI. Consulting, architecture, and implementation services with transparent hourly pricing and online booking at " +
      `${SITE_URL}/schedule`,
    "",
    "## Services",
    "",
    "### مشاوره / Consulting — " + `${SITE_URL}/services-consult`,
    "جلسه مشاوره تخصصی دِواپس، زیرساخت ابری و هوش مصنوعی با نرخ ساعتی شفاف؛ زمان جلسه را آنلاین انتخاب و رزرو کنید.",
    "Expert DevOps, cloud and AI consulting sessions with transparent hourly rates, booked online.",
    "",
    "### معماری / Architecture — " + `${SITE_URL}/services-architect`,
    "طراحی معماری زیرساخت ابری مقیاس‌پذیر، امن و مقرون‌به‌صرفه برای محصول شما.",
    "Design of scalable, secure, cost-effective cloud infrastructure.",
    "",
    "### پیاده‌سازی / Implementation — " + `${SITE_URL}/services-implement`,
    "پیاده‌سازی عملی دِواپس، زیرساخت ابری و راهکارهای هوش مصنوعی؛ از CI/CD و زیرساخت به‌صورت کد تا استقرار مدل‌های هوش مصنوعی.",
    "Hands-on implementation of CI/CD, infrastructure as code, and AI solutions.",
    "",
  ];

  for (const locale of ["fa", "en"] as const) {
    sections.push(`## Blog articles (${locale === "fa" ? "فارسی" : "English"})`, "");
    for (const a of getArticles(locale)) {
      sections.push(
        `# ${a.title}`,
        "",
        `URL: ${SITE_URL}/blog/${a.slug}`,
        `Published: ${a.publishedAt.slice(0, 10)}${a.updatedAt ? ` | Updated: ${a.updatedAt.slice(0, 10)}` : ""}`,
        "",
        a.content,
        "",
        "---",
        "",
      );
    }
  }

  sections.push("## FAQ (فارسی)", "");
  for (const f of getFaqs("fa")) {
    sections.push(`### ${f.question}`, f.answer, "");
  }
  sections.push("## FAQ (English)", "");
  for (const f of getFaqs("en")) {
    sections.push(`### ${f.question}`, f.answer, "");
  }

  return new Response(sections.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
