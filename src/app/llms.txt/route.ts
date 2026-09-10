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
    "## Courses",
    "",
    `- [دوره‌ها / Courses](${SITE_URL}/courses): Live online workshops taught in small cohorts, with a real project`,
    `- [دوره ساخت ایجنت هوش مصنوعی / Building AI Agents](${SITE_URL}/courses/ai-agent-course): 10-week live workshop starting Friday 23 October 2026, Fridays 12:00-14:00 Tehran time, 20 hours across 12 modules and 93 lessons, capped at 12 seats. 4,980,000 Toman for people living in Iran, reduced from 16,600,000 because of the situation there; A$100 for everyone else. Covers Linux and the terminal including curl, every current model API (OpenAI Chat Completions and Responses, Anthropic Messages, Google Gemini via AI Studio and Vertex), running models locally with Ollama, how an agent works, the open web, hands-on Claude Code, Codex and opencode, safety and cost, no-code tools and agent orchestration patterns, and building plus deploying an agent as a capstone`,
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
