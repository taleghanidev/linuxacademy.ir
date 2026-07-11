#!/usr/bin/env python3
"""One-time Google Search Console OAuth consent (loopback flow, stdlib only).

Reuses the existing Desktop OAuth client (project gog-mehdii-2026) whose
id/secret live in ~/.ytcli/token-linuxacademy.ir.json, but requests the
webmasters scope. Saves the refresh token to ~/.linuxacademy-gsc-token.json.

Run:  python3 scripts/gsc-auth.py   (then open the printed URL in a browser
logged into mehdiitaleghanii@gmail.com and approve)
"""

import http.server
import json
import secrets
import urllib.parse
import urllib.request
from pathlib import Path

PORT = 8124
SCOPE = "https://www.googleapis.com/auth/webmasters"
SRC = Path.home() / ".ytcli" / "token-linuxacademy.ir.json"
DST = Path.home() / ".linuxacademy-gsc-token.json"

client = json.loads(SRC.read_text())
client_id, client_secret = client["client_id"], client["client_secret"]
redirect_uri = f"http://localhost:{PORT}/"
state = secrets.token_urlsafe(16)

auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "response_type": "code",
    "scope": SCOPE,
    "access_type": "offline",
    "prompt": "consent",
    "state": state,
})

print("\nOpen this URL in the browser (account: mehdiitaleghanii@gmail.com):\n")
print(auth_url)
print(f"\nWaiting for the redirect on http://localhost:{PORT} ...")

code_holder = {}


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        if qs.get("state", [""])[0] == state and "code" in qs:
            code_holder["code"] = qs["code"][0]
            body = b"<h2>Done. You can close this tab and return to the terminal.</h2>"
        else:
            body = b"<h2>Missing or mismatched code/state; try again.</h2>"
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(body)

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
if "refresh_token" not in resp:
    raise SystemExit(f"No refresh_token in response: {resp}")

DST.write_text(json.dumps({
    "client_id": client_id,
    "client_secret": client_secret,
    "refresh_token": resp["refresh_token"],
    "scope": SCOPE,
}, indent=2))
DST.chmod(0o600)
print(f"\nSaved Search Console token to {DST}")
