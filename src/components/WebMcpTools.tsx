"use client";

import { useEffect } from "react";
import { getArticleBySlug, getArticles, getFaqs } from "@/config/content";

// WebMCP: registers in-page tools with browser AI agents that support the
// navigator.modelContext proposal (webmachinelearning/webmcp). No-op elsewhere.

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: object;
  execute: (
    args: Record<string, unknown>,
  ) => Promise<{ content: { type: "text"; text: string }[] }>;
};

type ModelContext = {
  registerTool?: (tool: WebMcpTool) => void;
  provideContext?: (ctx: { tools: WebMcpTool[] }) => void;
};

const LANG_SCHEMA = {
  type: "string",
  enum: ["fa", "en"],
  description: "Content language: fa (Farsi, default) or en (English)",
};

function text(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function lang(args: Record<string, unknown>): "fa" | "en" {
  return args?.lang === "en" ? "en" : "fa";
}

const TOOLS: WebMcpTool[] = [
  {
    name: "list_services",
    description:
      "List Linux Academy's consulting, architecture, and implementation services with page paths.",
    inputSchema: { type: "object", properties: {} },
    execute: async () =>
      text([
        { name: "مشاوره (Consulting)", path: "/services-consult" },
        { name: "معماری (Architecture)", path: "/services-architect" },
        { name: "پیاده‌سازی (Implementation)", path: "/services-implement" },
      ]),
  },
  {
    name: "list_articles",
    description: "List Linux Academy blog articles (slug, title, summary).",
    inputSchema: { type: "object", properties: { lang: LANG_SCHEMA } },
    execute: async (args) =>
      text(
        getArticles(lang(args)).map((a) => ({
          slug: a.slug,
          title: a.title,
          summary: a.summary,
          path: `/blog/${a.slug}`,
        })),
      ),
  },
  {
    name: "get_article",
    description: "Get the full markdown text of a Linux Academy blog article by slug.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" }, lang: LANG_SCHEMA },
      required: ["slug"],
    },
    execute: async (args) => {
      const article = getArticleBySlug(String(args?.slug ?? ""), lang(args));
      return text(
        article
          ? { title: article.title, content: article.content, faq: article.faq ?? [] }
          : { error: `No article with slug "${args?.slug}"` },
      );
    },
  },
  {
    name: "get_faq",
    description: "Get frequently asked questions about Linux Academy's services.",
    inputSchema: { type: "object", properties: { lang: LANG_SCHEMA } },
    execute: async (args) => text(getFaqs(lang(args))),
  },
  {
    name: "book_consultation",
    description:
      "Open the consultation booking page where the user can pick a time and duration and pay online.",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      window.location.assign("/schedule");
      return text({ ok: true, navigatedTo: "/schedule" });
    },
  },
];

export default function WebMcpTools() {
  useEffect(() => {
    const modelContext = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!modelContext) return;
    try {
      if (typeof modelContext.registerTool === "function") {
        for (const tool of TOOLS) modelContext.registerTool(tool);
      } else if (typeof modelContext.provideContext === "function") {
        modelContext.provideContext({ tools: TOOLS });
      }
    } catch {
      // Experimental API — never let it break the page.
    }
  }, []);

  return null;
}
