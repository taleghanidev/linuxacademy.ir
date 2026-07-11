#!/usr/bin/env python3
"""Submit the sitemap to Google Search Console (stdlib only).

Needs ~/.linuxacademy-gsc-token.json from scripts/gsc-auth.py.
Run AFTER the site is deployed so /sitemap.xml is live:
    python3 scripts/gsc-submit-sitemap.py
"""

import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

SITEMAP = "https://linuxacademy.ir/sitemap.xml"
TOKEN_FILE = Path.home() / ".linuxacademy-gsc-token.json"

tok = json.loads(TOKEN_FILE.read_text())
data = urllib.parse.urlencode({
    "client_id": tok["client_id"],
    "client_secret": tok["client_secret"],
    "refresh_token": tok["refresh_token"],
    "grant_type": "refresh_token",
}).encode()
access = json.loads(
    urllib.request.urlopen("https://oauth2.googleapis.com/token", data=data).read()
)["access_token"]
auth = {"Authorization": f"Bearer {access}"}


def api(method, url):
    req = urllib.request.Request(url, headers=auth, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read().decode()
            return r.status, body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


status, body = api("GET", "https://www.googleapis.com/webmasters/v3/sites")
print(f"Sites in Search Console ({status}):")
sites = json.loads(body).get("siteEntry", []) if status == 200 else []
for s in sites:
    print(f"  {s['siteUrl']}  ({s['permissionLevel']})")

# Prefer the domain property; fall back to the URL-prefix property.
candidates = ["sc-domain:linuxacademy.ir", "https://linuxacademy.ir/"]
known = {s["siteUrl"] for s in sites}
target = next((c for c in candidates if c in known), None)
if not target:
    raise SystemExit(
        "linuxacademy.ir is not a verified property on this Google account yet — "
        "finish verification in Search Console first."
    )

url = (
    f"https://www.googleapis.com/webmasters/v3/sites/"
    f"{urllib.parse.quote(target, safe='')}/sitemaps/{urllib.parse.quote(SITEMAP, safe='')}"
)
status, body = api("PUT", url)
print(f"\nSubmit {SITEMAP} to {target}: HTTP {status} {'OK' if status == 200 else body}")
