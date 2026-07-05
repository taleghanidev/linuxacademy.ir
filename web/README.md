# Linux Academy — web

A lean Next.js store: **consulting bookings** + **ad/sponsorship sales**, with a
private **admin dashboard**. Everything else (marketing pages, blog) is static.

Fully deployable on **Vercel + Neon** — no S3, no CMS, no self-hosted services.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| DB | Neon (Postgres) via Drizzle ORM |
| Auth (admin only) | Clerk |
| Payments | Zarinpal |
| Blog | Static MDX files |
| Calendar (optional) | Google Calendar |

## What's persisted
Only two things go in the database — `bookings` and `sponsorships` (plus a
`customers` table for contact details). See `src/db/schema.ts`.

## Local setup

```bash
cp .env.example .env      # then fill in real values
npm install
npm run db:push           # create tables in your Neon DB
npm run dev
```

Open http://localhost:3000. Admin is at `/admin` (requires Clerk login).

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon Postgres connection string |
| `ZARINPAL_MERCHANT_ID` | ✅ | Zarinpal payments |
| `ZARINPAL_BASE_URL` | ✅ | `https://api.zarinpal.com` (prod) / `https://sandbox.zarinpal.com` (test) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public URL, used to build payment callback URLs |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk admin login |
| `CLERK_SECRET_KEY` | ✅ | Clerk admin login |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` / `GOOGLE_CALENDAR_ID` | optional | Auto calendar invite on paid bookings. Leave blank to disable. |

## Managing products (static, in code)
- Consulting packages & sponsorship tiers/prices: `src/config/products.ts`
- Blog posts: add `src/app/blog/<slug>/page.mdx` + an entry in `src/config/posts.ts`

## Payment flow
1. Customer submits `/book` or `/sponsor` form → `POST /api/bookings|sponsorships`
2. Server creates a `PENDING` row, calls Zarinpal, returns the `StartPay` URL
3. Customer pays, Zarinpal redirects to `/api/*/verify`
4. Server verifies, marks row `PAID`, redirects to the thank-you page
5. Row appears in `/admin`

## Deploy (Vercel)
1. Push repo, import the `web/` directory into Vercel
2. Add all env vars in the Vercel project settings
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Run `npm run db:migrate` (or `db:push`) against your Neon database
5. Add the production callback domain in your Zarinpal panel

## Scripts
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run db:generate` — generate SQL migration from schema
- `npm run db:push` — push schema to DB (dev)
- `npm run db:migrate` — apply migrations (prod)
- `npm run db:studio` — Drizzle Studio
