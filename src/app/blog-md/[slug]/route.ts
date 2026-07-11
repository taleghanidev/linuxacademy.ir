import { getArticleBySlug, getArticles } from "@/config/content";
import { SITE_URL } from "@/lib/seo";

// Raw-markdown mirror of each blog article, exposed as /blog/<slug>.md via a
// rewrite in next.config.ts. Noindexed with a canonical Link header pointing
// at the HTML page — AI agents get clean markdown, search engines index the
// HTML page only. robots.txt must NOT block *.md (blocked crawlers can't see
// the noindex header).

export const dynamic = "force-static";

export function generateStaticParams() {
  return getArticles("fa").map((a) => ({ slug: a.slug }));
}

export function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const fa = getArticleBySlug(slug, "fa");
    const en = getArticleBySlug(slug, "en");
    if (!fa) return new Response("Not found", { status: 404 });

    const parts = [
      `# ${fa.title}`,
      "",
      `> ${fa.summary}`,
      "",
      `- Canonical: ${SITE_URL}/blog/${fa.slug}`,
      `- Published: ${fa.publishedAt.slice(0, 10)}${fa.updatedAt ? ` | Updated: ${fa.updatedAt.slice(0, 10)}` : ""}`,
      `- Language: فارسی (English version below)`,
      "",
      fa.content,
    ];
    if (en) {
      parts.push("", "---", "", `# ${en.title}`, "", `> ${en.summary}`, "", en.content);
    }

    return new Response(parts.join("\n"), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Robots-Tag": "noindex",
        Link: `<${SITE_URL}/blog/${fa.slug}>; rel="canonical"`,
      },
    });
  });
}
