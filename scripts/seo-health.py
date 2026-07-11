#!/usr/bin/env python3
"""SEO health report for linuxacademy.ir (stdlib only).

Pulls errors, warnings, and improvement signals from:
  - Google Search Console: sitemap errors/warnings, per-URL index inspection
    (verdict, coverage, canonical, rich-results issues), search performance
    (28 days) with CTR/position opportunities
  - Bing Webmaster Tools: crawl stats/issues, query stats, rank & traffic
  - PageSpeed Insights (keyless): SEO + performance audits for key pages

Credentials: GSC_* env vars or ~/.linuxacademy-gsc-token.json (Google);
BING_WEBMASTER_API_KEY env var or repo .env (Bing).

Output: markdown report on stdout. Exit 1 if critical errors were found
(so CI can alert), else 0.
"""

import json
import os
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

socket.setdefaulttimeout(30)

SITE = "https://linuxacademy.ir"
GSC_PROPERTY = "sc-domain:linuxacademy.ir"
BING_SITE = "https://linuxacademy.ir/"
PSI_PAGES = [f"{SITE}/", f"{SITE}/blog/getting-started-with-devops"]

critical: list[str] = []
warnings_: list[str] = []
suggestions: list[str] = []


def http_json(url, data=None, headers=None, method=None, timeout=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Content-Type": "application/json", **(headers or {})},
        method=method or ("POST" if data is not None else "GET"),
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


# ---------- credentials ----------

def gsc_access_token():
    if all(os.environ.get(f"GSC_{k}") for k in ("CLIENT_ID", "CLIENT_SECRET", "REFRESH_TOKEN")):
        tok = {
            "client_id": os.environ["GSC_CLIENT_ID"],
            "client_secret": os.environ["GSC_CLIENT_SECRET"],
            "refresh_token": os.environ["GSC_REFRESH_TOKEN"],
        }
    else:
        tok = json.loads((Path.home() / ".linuxacademy-gsc-token.json").read_text())
    data = urllib.parse.urlencode({
        "client_id": tok["client_id"],
        "client_secret": tok["client_secret"],
        "refresh_token": tok["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    resp = json.loads(urllib.request.urlopen("https://oauth2.googleapis.com/token", data=data).read())
    return resp["access_token"]


def bing_key():
    key = os.environ.get("BING_WEBMASTER_API_KEY")
    if key:
        return key
    env = Path(__file__).resolve().parent.parent / ".env"
    for line in env.read_text().splitlines():
        if line.startswith("BING_WEBMASTER_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("No BING_WEBMASTER_API_KEY found")


def sitemap_urls():
    xml = urllib.request.urlopen(f"{SITE}/sitemap.xml").read().decode()
    return re.findall(r"<loc>([^<]+)</loc>", xml)


# ---------- Google Search Console ----------

def gsc_report(auth):
    print("## Google Search Console\n")

    # Sitemaps
    r = http_json(
        f"https://www.googleapis.com/webmasters/v3/sites/{urllib.parse.quote(GSC_PROPERTY, safe='')}/sitemaps",
        headers=auth,
    )
    for s in r.get("sitemap", []):
        errs, warns = int(s.get("errors", 0)), int(s.get("warnings", 0))
        contents = s.get("contents", [{}])[0]
        line = (
            f"- Sitemap `{s['path']}`: {contents.get('submitted', '?')} submitted, "
            f"{contents.get('indexed', '?')} indexed, {errs} errors, {warns} warnings "
            f"(last downloaded {s.get('lastDownloaded', 'never')})"
        )
        print(line)
        if errs:
            critical.append(f"GSC sitemap has {errs} errors")
        if warns:
            warnings_.append(f"GSC sitemap has {warns} warnings")

    # Per-URL inspection
    print("\n### URL inspection (index status per page)\n")
    print("| URL | Verdict | Coverage | Last crawl | Issues |")
    print("| --- | --- | --- | --- | --- |")
    for url in sitemap_urls():
        try:
            r = http_json(
                "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
                data={"inspectionUrl": url, "siteUrl": GSC_PROPERTY},
                headers=auth,
            )
            res = r.get("inspectionResult", {})
            idx = res.get("indexStatusResult", {})
            verdict = idx.get("verdict", "?")
            coverage = idx.get("coverageState", "?")
            crawl = (idx.get("lastCrawlTime") or "never")[:10]
            issues = []
            if idx.get("robotsTxtState") not in (None, "ALLOWED"):
                issues.append(f"robots:{idx['robotsTxtState']}")
            gc, uc = idx.get("googleCanonical"), idx.get("userCanonical")
            if gc and uc and gc.rstrip("/") != uc.rstrip("/"):
                issues.append(f"canonical mismatch ({gc})")
                warnings_.append(f"Canonical mismatch on {url}: Google chose {gc}")
            rich = res.get("richResultsResult", {})
            for item in rich.get("detectedItems", []):
                for it in item.get("items", []):
                    for iss in it.get("issues", []):
                        sev = iss.get("severity", "")
                        issues.append(f"rich-result {sev}: {iss.get('issueMessage', '?')}")
                        target = critical if sev == "ERROR" else warnings_
                        target.append(f"Rich result {sev} on {url}: {iss.get('issueMessage')}")
            if verdict == "FAIL":
                critical.append(f"GSC verdict FAIL for {url}: {coverage}")
            elif verdict == "NEUTRAL":
                suggestions.append(f"Not indexed yet: {url} ({coverage})")
            short = url.replace(SITE, "") or "/"
            print(f"| {short} | {verdict} | {coverage} | {crawl} | {'; '.join(issues) or '—'} |")
        except urllib.error.HTTPError as e:
            print(f"| {url} | inspect failed HTTP {e.code} | | | |")
            warnings_.append(f"URL inspection failed for {url}: HTTP {e.code}")

    # Search performance, last 28 days
    print("\n### Search performance (28 days)\n")
    import datetime
    end = datetime.date.today() - datetime.timedelta(days=1)
    start = end - datetime.timedelta(days=28)
    body = {"startDate": str(start), "endDate": str(end), "rowLimit": 25}
    for dim in ("page", "query"):
        try:
            r = http_json(
                f"https://www.googleapis.com/webmasters/v3/sites/{urllib.parse.quote(GSC_PROPERTY, safe='')}/searchAnalytics/query",
                data={**body, "dimensions": [dim]},
                headers=auth,
            )
            rows = r.get("rows", [])
            print(f"Top {dim}s: " + (", ".join(
                f"{row['keys'][0]} ({row['clicks']}c/{row['impressions']}i/pos {row['position']:.1f})"
                for row in rows[:5]) or "no data yet"))
            for row in rows:
                if row["impressions"] >= 20 and 4 <= row["position"] <= 20:
                    suggestions.append(
                        f"Opportunity {dim} '{row['keys'][0]}': position {row['position']:.1f} "
                        f"with {row['impressions']} impressions — improve content/links to reach top 3"
                    )
                if row["impressions"] >= 50 and row["ctr"] < 0.01:
                    suggestions.append(
                        f"Low CTR {dim} '{row['keys'][0]}': {row['impressions']} impressions but "
                        f"CTR {row['ctr']:.1%} — rewrite title/description"
                    )
        except urllib.error.HTTPError as e:
            print(f"({dim} performance query failed: HTTP {e.code})")
    print()


# ---------- Bing Webmaster ----------

def bing_report(key):
    print("## Bing Webmaster Tools\n")
    base = "https://ssl.bing.com/webmaster/api.svc/json"
    q = f"apikey={key}&siteUrl={urllib.parse.quote(BING_SITE, safe='')}"

    def call(method, extra=""):
        return http_json(f"{base}/{method}?{q}{extra}")["d"]

    # Crawl issues — the error feed
    try:
        issues = call("GetCrawlIssues") or []
        if issues:
            print(f"### Crawl issues ({len(issues)})\n")
            for i in issues[:25]:
                desc = i.get("Issue", i)
                print(f"- {i.get('Url', '?')}: {desc}")
                critical.append(f"Bing crawl issue on {i.get('Url', '?')}: {desc}")
        else:
            print("Crawl issues: none reported.")
    except Exception as e:
        print(f"GetCrawlIssues unavailable: {e}")

    # Crawl stats
    try:
        stats = call("GetCrawlStats") or []
        if stats:
            last = stats[-1]
            errs = sum(int(last.get(k, 0)) for k in last if "Error" in k or "error" in k)
            print(f"\nCrawl stats (latest day): crawled={last.get('CrawledPages', '?')}, "
                  f"in index={last.get('InIndexPages', last.get('InIndex', '?'))}, "
                  f"error-ish counters={errs}")
            allcodes = {k: v for k, v in last.items() if k.startswith(("Code", "AllStatusCodes")) and v}
            if allcodes:
                print(f"Status code counters: {allcodes}")
    except Exception as e:
        print(f"GetCrawlStats unavailable: {e}")

    # Rank & traffic + queries
    for method, label in (("GetRankAndTrafficStats", "Rank & traffic"), ("GetQueryStats", "Top queries")):
        try:
            rows = call(method) or []
            if rows:
                print(f"\n{label} (latest): " + json.dumps(rows[-1] if method == "GetRankAndTrafficStats" else rows[:5], ensure_ascii=False)[:500])
            else:
                print(f"\n{label}: no data yet.")
        except Exception as e:
            print(f"\n{method} unavailable: {e}")

    # Link counts
    try:
        links = call("GetLinkCounts")
        total = links.get("TotalLinks") if isinstance(links, dict) else links
        print(f"\nInbound links known to Bing: {total}")
    except Exception as e:
        print(f"\nGetLinkCounts unavailable: {e}")
    print()


# ---------- PageSpeed Insights ----------

def psi_report():
    print("## PageSpeed Insights (mobile)\n")
    for url in PSI_PAGES:
        try:
            api = ("https://www.googleapis.com/pagespeedonline/v5/runPagespeed?"
                   + urllib.parse.urlencode({"url": url, "strategy": "mobile"})
                   + "&category=SEO&category=PERFORMANCE")
            r = http_json(api, timeout=120)
            lh = r.get("lighthouseResult", {})
            cats = lh.get("categories", {})
            seo = round((cats.get("seo", {}).get("score") or 0) * 100)
            perf = round((cats.get("performance", {}).get("score") or 0) * 100)
            print(f"### {url}\nSEO score: {seo}/100 · Performance: {perf}/100")
            audits = lh.get("audits", {})
            failed = [
                a for a in audits.values()
                if a.get("score") is not None and a["score"] < 0.9
                and a.get("scoreDisplayMode") in ("binary", "numeric")
            ]
            for a in sorted(failed, key=lambda x: x["score"])[:8]:
                line = f"{a['title']} (score {a['score']})"
                print(f"- {line}")
                if a["id"] in ("is-crawlable", "http-status-code", "canonical", "hreflang", "robots-txt"):
                    critical.append(f"PSI SEO failure on {url}: {line}")
                else:
                    suggestions.append(f"PSI on {url}: {line}")
            if perf and perf < 60:
                warnings_.append(f"Performance score {perf}/100 on {url}")
            print()
        except Exception as e:
            print(f"PSI failed for {url}: {e}\n")
            warnings_.append(f"PSI failed for {url}: {e}")


def main():
    print(f"# SEO health report — linuxacademy.ir\n")
    try:
        gsc_report({"Authorization": f"Bearer {gsc_access_token()}"})
    except Exception as e:
        print(f"GSC section failed entirely: {e}\n")
        critical.append(f"GSC unreachable: {e}")
    try:
        bing_report(bing_key())
    except Exception as e:
        print(f"Bing section failed entirely: {e}\n")
        critical.append(f"Bing unreachable: {e}")
    # PageSpeed Insights is slow (~1 min/page); opt in with RUN_PSI=1.
    if os.environ.get("RUN_PSI") == "1":
        psi_report()

    print("## Summary\n")
    print(f"- 🔴 Critical: {len(critical)}")
    for c in critical:
        print(f"  - {c}")
    print(f"- 🟡 Warnings: {len(warnings_)}")
    for w in warnings_:
        print(f"  - {w}")
    print(f"- 💡 Suggestions: {len(suggestions)}")
    for s in suggestions:
        print(f"  - {s}")
    sys.exit(1 if critical else 0)


if __name__ == "__main__":
    main()
