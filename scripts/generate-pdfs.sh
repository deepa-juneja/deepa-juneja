#!/usr/bin/env bash
# Generate all six role-tailored resume PDFs from the JSON data.
# Uses macOS Google Chrome in headless mode — no extra dependencies.
# Output: resumes/Deepa Juneja - <Role>.pdf
#
# Re-run any time data/profile.json or any data/roles/*.json changes.
#
# Usage:
#   scripts/generate-pdfs.sh          # generates all six
#   npm run generate-pdfs             # same thing

set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT="${PORT:-8765}"
OUT_DIR="resumes"

if [[ ! -x "$CHROME" ]]; then
  echo "Google Chrome not found at $CHROME"
  echo "Install it from https://www.google.com/chrome/ or edit CHROME in this script."
  exit 1
fi

if [[ ! -f "data/profile.json" ]]; then
  echo "Run this from the repo root (data/profile.json not found)."
  exit 1
fi

# Validate data first — abort if the JSON is broken.
node scripts/validate-data.mjs

mkdir -p "$OUT_DIR"

# Start a local static server in the background.
python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/genpdf-server.log 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT
sleep 1

# Wait until the server actually answers.
for i in 1 2 3 4 5; do
  if curl -fs "http://127.0.0.1:$PORT/index.html" -o /dev/null; then break; fi
  sleep 0.5
done

# role key  →  recruiter-facing filename suffix
declare -a ROLES=(
  "general|General"
  "training-ld|Training & L&D Coordinator"
  "edtech-counselor|EdTech Counsellor"
  "data-analyst|Data and MIS Analyst"
  "hr-operations|HR and Operations Coordinator"
  "school-coordinator|School Coordinator"
)

for entry in "${ROLES[@]}"; do
  key="${entry%%|*}"
  label="${entry##*|}"
  url="http://127.0.0.1:$PORT/resume.html?role=$key"
  pdf="$OUT_DIR/Deepa Juneja - $label.pdf"

  echo "→ $pdf"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --no-pdf-header-footer \
    --hide-scrollbars \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=10000 \
    --print-to-pdf="$pdf" \
    "$url" 2>/dev/null

  # Sanity check that the PDF is non-empty and is actually a PDF.
  if [[ ! -s "$pdf" ]]; then
    echo "  FAILED: $pdf was not written"
    exit 1
  fi
  if ! head -c 4 "$pdf" | grep -q "%PDF"; then
    echo "  FAILED: $pdf is not a valid PDF"
    exit 1
  fi
done

echo
echo "Generated $(ls -1 "$OUT_DIR"/*.pdf | wc -l | tr -d ' ') PDFs in $OUT_DIR/:"
ls -lh "$OUT_DIR"/
