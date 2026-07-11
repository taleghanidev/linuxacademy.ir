---
name: linuxacademy-aeo
description: "Publish AEO/SEO-optimized content on linuxacademy.ir and submit it for indexing. Use when adding/editing blog articles, doing SEO/AEO/GEO work, submitting URLs or sitemaps to Google/Bing/IndexNow, or touching the machine-readable surfaces (JSON-LD, llms.txt, /api/mcp, WebMCP)."
---

# linuxacademy.ir — AEO content & indexing workflow

## Where content lives

All articles are static data in `src/config/content.ts` (`ARTICLES`, **both** `fa` and `en` arrays — always add to both, same slug). Each article: markdown `content` (template literal), `summary`, `faq[]` (feeds FAQPage JSON-LD), `publishedAt`, `updatedAt`, `cover`. Sitemap, llms.txt, llms-full.txt, /api/mcp, and WebMCP tools all derive from this file automatically — no other file needs editing for a new article.

## Writing rules (research-verified AEO checklist)

Full checklist with sources in memory: `aeo-geo-blog-checklist`. Non-negotiables per article:

1. Open with an answer capsule: `**پاسخ کوتاه:** / **Short answer:**` — 2–3 sentences answering the title's question.
2. H2/H3 headings phrased as the questions users ask AI (question-shaped, long-tail).
3. Paragraphs under ~120 words; use real markdown lists and tables (remark-gfm is wired into the renderer).
4. Statistics and quotes with named sources inline ("according to DORA/Flexera/McKinsey…").
5. FAQ section (## پرسش‌های پرتکرار / ## Frequently asked questions) with 3–4 Q&As that MATCH the `faq[]` field.
6. Internal links to `/services-consult`, `/services-implement`, `/schedule`.
7. Set `updatedAt` to today (absolute ISO date).
8. No keyword stuffing — it measurably hurts generative-engine visibility.

## Verify before deploy

```
npx biome check <changed files>
npm run build        # all blog slugs must appear as ● (SSG)
```
Optionally `npm start` + curl the page and check `<title>` and `application/ld+json` blocks.

## Deploy

Local branch `deploy-clean` pushes to remote `main` (never push local `main` — old history has secrets):

```
git push "https://x-access-token:$(gh auth token)@github.com/taleghanidev/linuxacademy.ir.git" deploy-clean:main
```

Vercel auto-deploys in ~1 min. Poll `https://linuxacademy.ir/sitemap.xml` (and the new slug) for 200 before submitting.

## Submit indexing — AUTOMATIC on every deploy

`.github/workflows/submit-indexing.yml` runs on every push to main: waits until `/api/version` serves the pushed sha (Vercel deploy done), then submits the sitemap to Google Search Console (repo secrets `GSC_CLIENT_ID/SECRET/REFRESH_TOKEN`) and pings IndexNow. Nothing to run manually — check with `gh run list -R taleghanidev/linuxacademy.ir --workflow submit-indexing.yml`.

Manual fallback (same scripts, local token file):

```
python3 scripts/gsc-submit-sitemap.py    # Google: submits sitemap to sc-domain:linuxacademy.ir
node scripts/submit-indexnow.mjs         # IndexNow: Bing/Yandex/Seznam/Naver, all sitemap URLs
```

Optional targeted Bing push (quota 10k/day), key in local `.env` as `BING_WEBMASTER_API_KEY`:

```
curl -X POST "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=$BING_WEBMASTER_API_KEY" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"siteUrl":"https://linuxacademy.ir/","urlList":["https://linuxacademy.ir/blog/<slug>"]}'
```

## Credentials

- Google (Search Console + Calendar + YouTube, account mehdiitaleghanii@gmail.com): refresh token in `~/.linuxacademy-gsc-token.json`; re-consent with `python3 scripts/google-auth-all.py` (also refreshes `~/.linuxacademy-gcal-token.json` and the `~/.ytcli/token*.json` yt-CLI profiles).
- Bing Webmaster API key: local `.env` (`BING_WEBMASTER_API_KEY`), never commit.
- IndexNow key: `public/4a0f117bb3f243fc693a9d891442217a.txt` (intentionally public) + same literal in `scripts/submit-indexnow.mjs` — rotate BOTH together.

## Machine-readable surfaces (keep in sync when structure changes)

- Per-page metadata + JSON-LD: `(site)/*/page.tsx` server wrappers, helpers in `src/lib/seo.ts`, `src/components/JsonLd.tsx`.
- `/llms.txt`, `/llms-full.txt`: route handlers under `src/app/`.
- MCP server: `src/app/api/mcp/route.ts` (+ `public/.well-known/mcp.json`, CORS header in next.config); WebMCP: `src/components/WebMcpTools.tsx`.
- New static page? Add it to `src/app/sitemap.ts` AND `src/app/llms.txt/route.ts` (hand-maintained lists).

## Markdown mirrors (.md twins for AI agents)

Every article is also served as raw markdown at `/blog/<slug>.md` (rewrite in `next.config.ts` → `src/app/blog-md/[slug]/route.ts`, generated from content.ts — new articles get one automatically). Rules (memory: `md-mirror-ai-visibility`):

- Every `.md` response: `X-Robots-Tag: noindex` + `Link: <html-page-url>; rel="canonical"` + `Content-Type: text/markdown; charset=utf-8`
- Every HTML content page's head: `<link rel="alternate" type="text/markdown" href=".../page.md">` (via `alternates.types` in metadata)
- robots.txt must allow everything — NEVER `Disallow /*.md` (blocked crawlers can't see the noindex header)
- Do NOT put .md URLs in the sitemap or submit them for indexing — they're mirrors, not pages.

## Known issues (confirmed audit 2026-07-11, unfixed)

See memory `linuxacademy-pending` item 10. Worst: unknown `/blog/*` slugs return indexable 200 soft-404s; WebMcpTools ships the whole article corpus in every page's JS bundle; blog-index JSON-LD uses TechArticle where BlogPosting is required. Fix before large content pushes.
