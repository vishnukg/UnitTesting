#!/usr/bin/env bash
# Updates the date in presso.md to today and launches presenterm
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PRESSO="$SCRIPT_DIR/presso.md"

TODAY=$(date +%Y-%m-%d)
sed -i '' "s/^date: \".*\"/date: \"$TODAY\"/" "$PRESSO"

exec presenterm "$PRESSO" "$@"
