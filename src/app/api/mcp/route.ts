import { getArticleBySlug, getArticles, getFaqs } from "@/config/content";
import { SITE_URL } from "@/lib/seo";

// Minimal stateless MCP server (Streamable HTTP transport, JSON responses).
// Read-only tools over the site's static content — lets AI agents query
// services, articles, and FAQs directly.

const PROTOCOL_VERSION = "2025-06-18";

const SERVICES = [
  {
    id: "consulting",
    name: "مشاوره (Consulting)",
    description:
      "Expert DevOps, cloud and AI consulting sessions with transparent hourly rates, booked online.",
    url: `${SITE_URL}/services-consult`,
  },
  {
    id: "architecture",
    name: "معماری (Architecture)",
    description: "Design of scalable, secure, cost-effective cloud infrastructure.",
    url: `${SITE_URL}/services-architect`,
  },
  {
    id: "implementation",
    name: "پیاده‌سازی (Implementation)",
    description: "Hands-on implementation of CI/CD, infrastructure as code, and AI solutions.",
    url: `${SITE_URL}/services-implement`,
  },
];

const LANG_SCHEMA = {
  type: "string",
  enum: ["fa", "en"],
  description: "Content language: fa (Farsi, default) or en (English)",
};

const TOOLS = [
  {
    name: "list_services",
    description:
      "List Linux Academy's consulting, architecture, and implementation services with links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_articles",
    description: "List blog articles (slug, title, summary, URL).",
    inputSchema: {
      type: "object",
      properties: { lang: LANG_SCHEMA },
      additionalProperties: false,
    },
  },
  {
    name: "get_article",
    description: "Get the full markdown text of a blog article by slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Article slug from list_articles" },
        lang: LANG_SCHEMA,
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "get_faq",
    description: "Get frequently asked questions and answers about Linux Academy's services.",
    inputSchema: {
      type: "object",
      properties: { lang: LANG_SCHEMA },
      additionalProperties: false,
    },
  },
  {
    name: "get_booking_info",
    description: "How to book a consultation session (pricing model and booking URL).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function lang(args: Record<string, unknown> | undefined): "fa" | "en" {
  return args?.lang === "en" ? "en" : "fa";
}

function callTool(name: string, args: Record<string, unknown> | undefined) {
  switch (name) {
    case "list_services":
      return SERVICES;
    case "list_articles":
      return getArticles(lang(args)).map((a) => ({
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        url: `${SITE_URL}/blog/${a.slug}`,
        publishedAt: a.publishedAt,
      }));
    case "get_article": {
      const article = getArticleBySlug(String(args?.slug ?? ""), lang(args));
      if (!article) return { error: `No article with slug "${args?.slug}"` };
      return {
        title: article.title,
        summary: article.summary,
        url: `${SITE_URL}/blog/${article.slug}`,
        publishedAt: article.publishedAt,
        content: article.content,
        faq: article.faq ?? [],
      };
    }
    case "get_faq":
      return getFaqs(lang(args));
    case "get_booking_info":
      return {
        howToBook:
          "Pick a time and duration online; the price is calculated from an hourly rate and shown transparently before payment.",
        bookingUrl: `${SITE_URL}/schedule`,
        contactUrl: `${SITE_URL}/contact`,
      };
    default:
      return null;
  }
}

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: number | string | null;
  method?: string;
  params?: Record<string, unknown>;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Mcp-Protocol-Version, Mcp-Session-Id",
};

function rpcResponse(id: JsonRpcRequest["id"], result: object) {
  return Response.json({ jsonrpc: "2.0", id: id ?? null, result }, { headers: CORS_HEADERS });
}

function rpcError(id: JsonRpcRequest["id"], code: number, message: string) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    { headers: CORS_HEADERS },
  );
}

export async function POST(request: Request) {
  let body: JsonRpcRequest;
  try {
    body = await request.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }

  const { id, method, params } = body;

  switch (method) {
    case "initialize":
      return rpcResponse(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: {
          name: "linuxacademy-ir",
          title: "Linux Academy (linuxacademy.ir)",
          version: "1.0.0",
        },
        instructions:
          "Read-only tools for Linux Academy: Persian/English consulting firm for DevOps, cloud, and AI. Use list_articles/get_article for blog content, list_services and get_booking_info for services and booking.",
      });
    case "notifications/initialized":
    case "notifications/cancelled":
      return new Response(null, { status: 202, headers: CORS_HEADERS });
    case "ping":
      return rpcResponse(id, {});
    case "tools/list":
      return rpcResponse(id, { tools: TOOLS });
    case "tools/call": {
      const name = String(params?.name ?? "");
      const args = params?.arguments as Record<string, unknown> | undefined;
      const result = callTool(name, args);
      if (result === null) return rpcError(id, -32602, `Unknown tool: ${name}`);
      return rpcResponse(id, {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      });
    }
    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

export function GET() {
  // Stateless server: no SSE stream. Clients should POST JSON-RPC messages.
  return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
