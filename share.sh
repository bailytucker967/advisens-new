#!/usr/bin/env bash
#
# Share the TWI Report Generator app with someone for review.
#
#   ./share.sh
#
# Starts the app (if it isn't already running) and opens a public Cloudflare
# tunnel. Your shareable link prints below as  https://<random>.trycloudflare.com
# Keep this Terminal window open while they review; press Ctrl-C to stop sharing.
#
# Your colleague signs in with:   preview-test@advisens.dev  /  TestPass1234
#
set -e
cd "$(dirname "$0")"

CF=/tmp/cloudflared
DEV_PID=""
cleanup() { [ -n "$DEV_PID" ] && kill "$DEV_PID" 2>/dev/null || true; }
trap cleanup EXIT

# 1) App on :3000
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "App already running on http://localhost:3000"
else
  echo "Starting the app on http://localhost:3000 ..."
  npm run dev > /tmp/twi-dev.log 2>&1 &
  DEV_PID=$!
  for i in $(seq 1 60); do
    grep -q "Ready in" /tmp/twi-dev.log 2>/dev/null && break
    sleep 1
  done
  echo "App is up."
fi

# 2) cloudflared (download once if needed)
if [ ! -x "$CF" ]; then
  echo "Downloading cloudflared (one-time)..."
  curl -fsSL -o /tmp/cloudflared.tgz \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64.tgz
  tar xzf /tmp/cloudflared.tgz -C /tmp && chmod +x "$CF"
fi

echo ""
echo "=================================================================="
echo " Opening your public review link below (look for trycloudflare.com)"
echo " Colleague login:  preview-test@advisens.dev  /  TestPass1234"
echo " Keep this window open while they review. Ctrl-C stops sharing."
echo "=================================================================="
echo ""

# 3) Public tunnel (http2 transport is the most firewall-friendly)
"$CF" tunnel --protocol http2 --url http://localhost:3000
