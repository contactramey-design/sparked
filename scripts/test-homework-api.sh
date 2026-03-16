#!/usr/bin/env bash
# Test Homework Adventure API. Run while dev:local or dev:api is running.
# Usage: ./scripts/test-homework-api.sh [BASE_URL] [no-openai]
#   no-openai = skip step 3 (does not call OpenAI; use to audit without using credits)
set -e
BASE="${1:-http://localhost:3001}"
SKIP_OPENAI="${2:-}"
[ "$SKIP_OPENAI" = "no-openai" ] && SKIP_OPENAI="1" || true

echo "=== 1. GET /api/config ==="
CONFIG=$(curl -s -w "\nHTTP %{http_code}" "$BASE/api/config")
echo "$CONFIG" | tail -5
echo "$CONFIG" | grep -q '"homeworkAdventureConfigured"' && echo "OK: config has homeworkAdventureConfigured" || true
echo "$CONFIG" | grep -q '"videoFeatureEnabled"' && echo "OK: config has videoFeatureEnabled" || true
echo ""

echo "=== 2. POST /api/process-homework (no body) - expect 400 ==="
R2=$(curl -s -w "\nHTTP %{http_code}" -X POST "$BASE/api/process-homework")
echo "$R2" | tail -5
echo "$R2" | grep -q '"error"' && echo "OK: returns JSON error" || true
echo "$R2" | grep -q "400" && echo "OK: HTTP 400 as expected" || true
echo ""

if [ -n "$SKIP_OPENAI" ]; then
  echo "=== 3. SKIPPED (no-openai) - not calling OpenAI ==="
  echo "Run without second arg to test full flow (uses OpenAI credits)."
  exit 0
fi

# Minimal 1x1 PNG (valid image) - this request WILL call OpenAI
TMP_PNG=$(mktemp).png
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" | base64 -d > "$TMP_PNG"

echo "=== 3. POST /api/process-homework (with 1x1 PNG) - calls OpenAI ==="
OUT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST -F "image=@$TMP_PNG" "$BASE/api/process-homework")
HTTP_CODE=$(echo "$OUT" | grep "HTTP_CODE:" | sed 's/HTTP_CODE://')
BODY=$(echo "$OUT" | sed '/HTTP_CODE:/d')
echo "HTTP $HTTP_CODE"
echo "$BODY" | head -c 500
echo ""
rm -f "$TMP_PNG"

if [ "$HTTP_CODE" = "200" ]; then
  echo "$BODY" | grep -q '"title"' && echo "OK: Got adventure with title"
  echo "$BODY" | grep -q '"steps"' && echo "OK: Got steps"
  echo "PASS: Full flow works."
elif [ "$HTTP_CODE" = "500" ]; then
  echo "FAIL: 500 - check OPENAI_API_KEY in .env (local) or Vercel env, and OpenAI billing"
  echo "$BODY" | head -c 300
  exit 1
else
  echo "Unexpected HTTP $HTTP_CODE"
  exit 1
fi
