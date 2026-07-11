#!/usr/bin/env python3
"""One Google consent for ALL scopes used on this machine, fanned out to every
token file (with .bak backups):

  - webmasters (Search Console)       -> ~/.linuxacademy-gsc-token.json
  - calendar                          -> ~/.linuxacademy-gcal-token.json
  - youtube / upload / force-ssl      -> ~/.ytcli/token.json + token-linuxacademy.ir.json

Reuses the existing Desktop OAuth client (project gog-mehdii-2026).
Run, open the printed URL (account: mehdiitaleghanii@gmail.com), approve.
"""

import datetime
import http.server
import json
import secrets
import shutil
import urllib.parse
import urllib.request
from pathlib import Path

PORT = 8124
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]
SRC = Path.home() / ".ytcli" / "token-linuxacademy.ir.json"

client = json.loads(SRC.read_text())
client_id, client_secret = client["client_id"], client["client_secret"]
redirect_uri = f"http://localhost:{PORT}/"
state = secrets.token_urlsafe(16)

auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "response_type": "code",
    "scope": " ".join(SCOPES),
    "access_type": "offline",
    "prompt": "consent",
    "state": state,
})

print("\n=== OPEN THIS URL (account: mehdiitaleghanii@gmail.com) ===\n", flush=True)
print(auth_url, flush=True)
print(f"\nWaiting for redirect on http://localhost:{PORT} ...", flush=True)

code_holder = {}


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        ok = qs.get("state", [""])[0] == state and "code" in qs
        if ok:
            code_holder["code"] = qs["code"][0]
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(
            b"<h2>Done. Return to the terminal.</h2>" if ok else b"<h2>Bad state/code.</h2>"
        )

    def log_message(self, *args):
        pass


with http.server.HTTPServer(("localhost", PORT), Handler) as srv:
    while "code" not in code_holder:
        srv.handle_request()

data = urllib.parse.urlencode({
    "code": code_holder["code"],
    "client_id": client_id,
    "client_secret": client_secret,
    "redirect_uri": redirect_uri,
    "grant_type": "authorization_code",
}).encode()
resp = json.loads(
    urllib.request.urlopen("https://oauth2.googleapis.com/token", data=data).read()
)
refresh_token = resp.get("refresh_token")
if not refresh_token:
    raise SystemExit(f"No refresh_token in response: {resp}")
access_token = resp["access_token"]
granted_scopes = resp.get("scope", "").split()

# Which account did we just authorize?
email = "?"
try:
    req = urllib.request.Request(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    email = json.loads(urllib.request.urlopen(req).read()).get("email", "?")
except Exception as e:
    print(f"(userinfo lookup failed: {e})")
print(f"\nAuthorized account: {email}")
print(f"Granted scopes: {granted_scopes}")


def backup(path: Path):
    if path.exists():
        shutil.copy2(path, path.with_suffix(path.suffix + ".bak"))


now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")

# 1) Search Console token (used by scripts/gsc-submit-sitemap.py)
gsc = Path.home() / ".linuxacademy-gsc-token.json"
backup(gsc)
gsc.write_text(json.dumps({
    "client_id": client_id,
    "client_secret": client_secret,
    "refresh_token": refresh_token,
    "scope": "https://www.googleapis.com/auth/webmasters",
    "account": email,
}, indent=2))
gsc.chmod(0o600)
print(f"wrote {gsc}")

# 2) Calendar token backup file (same shape as before)
gcal = Path.home() / ".linuxacademy-gcal-token.json"
backup(gcal)
gcal.write_text(json.dumps({
    "client_id": client_id,
    "client_secret": client_secret,
    "refresh_token": refresh_token,
    "scope": "https://www.googleapis.com/auth/calendar",
    "account": email,
}, indent=2))
gcal.chmod(0o600)
print(f"wrote {gcal}")

# 3) yt CLI profiles (google-auth Credentials format; expiry in the past forces refresh)
yt_token = {
    "token": access_token,
    "refresh_token": refresh_token,
    "token_uri": "https://oauth2.googleapis.com/token",
    "client_id": client_id,
    "client_secret": client_secret,
    "scopes": SCOPES,
    "universe_domain": "googleapis.com",
    "account": email,
    "expiry": now_iso,
}
for name in ["token.json", "token-linuxacademy.ir.json"]:
    p = Path.home() / ".ytcli" / name
    backup(p)
    p.write_text(json.dumps(yt_token))
    p.chmod(0o600)
    print(f"wrote {p}")

print("\nAll token files updated. Old files kept as *.bak")
