#!/usr/bin/env bash
# ponytail: cross-platform runner (bash — works on Linux, macOS, Git Bash / WSL on Windows)
set -euo pipefail

# --- env ---
BASE_URL="${BASE_URL:-http://localhost:3000}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
declare -a EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -e) EXTRA_ARGS+=("$2"); shift 2 ;;
    *) echo "Usage: $0 [-e KEY=VAL ...]"; exit 1 ;;
  esac
done

# --- 1. k6 installed? ---
if ! command -v k6 &>/dev/null; then
  echo "❌ k6 is not installed."
  echo "   Install: https://k6.io/docs/get-started/installation/"
  echo "   Or run: node $(realpath --relative-to=. "$SCRIPT_DIR/setup.js")"
  exit 1
fi
echo "✅ k6 $(k6 version)"

# --- 2. health check ---
echo "🔍 Checking server at ${BASE_URL}..."
if ! k6 run "${SCRIPT_DIR}/check-health.js" -e BASE_URL="${BASE_URL}" "${EXTRA_ARGS[@]}"; then
  echo "❌ Server unreachable. Aborting."
  exit 1
fi
echo ""

# --- 3. run sequence (each depends on previous passing) ---
PASS=0
FAIL=0

run_test() {
  local name="$1" file="$2" extra="${3:-}"
  echo "=== 🏃 $name ==="
  if k6 run "$file" -e BASE_URL="${BASE_URL}" ${extra:+"$extra"} "${EXTRA_ARGS[@]}"; then
    echo "✅ $name passed"
    PASS=$((PASS + 1))
  else
    echo "❌ $name failed — stopping pipeline"
    FAIL=$((FAIL + 1))
    return 1
  fi
  echo ""
}

run_test "smoke"  "${SCRIPT_DIR}/smoke-test.js"
run_test "load"   "${SCRIPT_DIR}/load-test.js"  "-e K6_OUT=json=load-test-results.json"
run_test "spike"  "${SCRIPT_DIR}/spike-test.js"
run_test "stress" "${SCRIPT_DIR}/stress-test.js"
[ $FAIL -eq 0 ] || exit 1  # skip soak if any earlier test failed

run_test "soak"   "${SCRIPT_DIR}/soak-test.js"

# --- summary ---
echo "=========================================="
echo "  ✅ Passed: $PASS  |  ❌ Failed: $FAIL"
echo "=========================================="
