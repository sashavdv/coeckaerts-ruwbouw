#!/usr/bin/env bash
# Bouwt de site en kopieert ze naar de Hetzner-server.
#
# Gebruik:
#   DEPLOY_HOST=gebruiker@jouw-server ./deploy/deploy.sh          # preview (noindex)
#   DEPLOY_HOST=gebruiker@jouw-server ./deploy/deploy.sh --live   # productie (indexeerbaar)
#
# De gebruiker op de server heeft schrijfrechten nodig op DEPLOY_PATH.
set -euo pipefail

: "${DEPLOY_HOST:?Zet DEPLOY_HOST, bv. DEPLOY_HOST=deploy@123.45.67.89}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/bc-bouw}"

cd "$(dirname "$0")/.."

if [[ "${1:-}" == "--live" ]]; then
  echo "→ Productiebuild (zoekmachines mogen indexeren)"
  export PUBLIC_SITE_LIVE=true
else
  echo "→ Previewbuild (noindex)"
fi

npm ci
npm run build

echo "→ Uploaden naar ${DEPLOY_HOST}:${DEPLOY_PATH}"
rsync -az --delete dist/ "${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "✓ Klaar"
