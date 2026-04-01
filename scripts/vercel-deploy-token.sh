#!/usr/bin/env bash
# Deploy from your laptop without `vercel login` (uses token only).
# 1) https://vercel.com/account/tokens → Create Token
# 2) echo 'VERCEL_TOKEN=your_token' > .env.vercel.local   (file is gitignored)
# 3) ./scripts/vercel-deploy-token.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env.vercel.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.vercel.local
  set +a
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Missing VERCEL_TOKEN. Add it to .env.vercel.local or export it." >&2
  echo "Create a token: https://vercel.com/account/tokens" >&2
  exit 1
fi

export VERCEL_ORG_ID="${VERCEL_ORG_ID:-team_wxKy7kl2V9WgbXPgqLBpkOzf}"
export VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_1W7vXsWJMEO5Yy8LrqNQZAA3j4KR}"

exec npx vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN"
