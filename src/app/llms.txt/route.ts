import { getArticles, getFaqs } from "@/config/content";
import { SITE_URL } from "@/lib/seo";

// /llms.txt — index for AI crawlers and agents, per the llmstxt.org convention.
export const dynamic = "force-static";

export function GET() {
  const fa = getArticles("fa");
  const en = getArticles("en");

  const lines = [
    "# لینوکس آکادمی (Linux Academy)",
    "",
    "> Persian-language (Farsi) consulting firm for DevOps, cloud infrastructure, and AI. We offer consulting, architecture, and implementation services with transparent hourly pricing and online booking. Primary language: Farsi (fa); English content available.",
    "",
    "## Services",
    "",
    `- [مشاوره / Consulting](${SITE_URL}/services-consult): DevOps, cloud and AI consulting sessions, booked online with transparent hourly rates`,
    `- [معماری / Architecture](${SITE_URL}/services-architect): Design of scalable, secure, cost-effective cloud infrastructure`,
    `- [پیاده‌سازی / Implementation](${SITE_URL}/services-implement): Hands-on implementation of CI/CD, infrastructure as code, and AI solutions`,
    `- [رزرو جلسه / Book a consultation](${SITE_URL}/schedule): Pick a time and duration online; price shown before payment`,
    "",
    "## Blog (فارسی)",
    "",
    ...fa.map((a) => `- [${a.title}](${SITE_URL}/blog/${a.slug}): ${a.summary}`),
    "",
    "## Blog (English)",
    "",
    ...en.map((a) => `- [${a.title}](${SITE_URL}/blog/${a.slug}): ${a.summary}`),
    "",
    "## FAQ",
    "",
    ...getFaqs("en").map((f) => `- ${f.question} ${f.answer}`),
    "",
    "## Optional",
    "",
    `- [Full content for LLMs](${SITE_URL}/llms-full.txt): Complete article texts and service details`,
    `- [Contact](${SITE_URL}/contact)`,
    `- [Privacy policy](${SITE_URL}/privacy-policy)`,
    `- [Terms of service](${SITE_URL}/terms-of-service)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
