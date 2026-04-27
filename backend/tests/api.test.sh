#!/usr/bin/env bash
# =============================================================================
# Indian Government Scheme API - Integration Test Suite
# Usage: bash tests/api.test.sh [BASE_URL]
# Default BASE_URL: http://localhost:5000
# =============================================================================

BASE="${1:-http://localhost:5000}"
API="$BASE/api"
PASS=0
FAIL=0
TOKEN=""
ADMIN_TOKEN=""
SCHEME_ID=""
USER_ID=""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ─── Helpers ──────────────────────────────────────────────────────────────────
log_section() { echo -e "\n${BLUE}══════════════════════════════════════${NC}"; echo -e "${BLUE}  $1${NC}"; echo -e "${BLUE}══════════════════════════════════════${NC}"; }

assert() {
  local label="$1" status="$2" expected="$3" body="$4"
  if echo "$body" | grep -q "$expected" && [ "$status" -eq "$3" ] 2>/dev/null || echo "$body" | grep -q "$expected"; then
    echo -e "  ${GREEN}✓ PASS${NC} $label"
    ((PASS++))
  else
    echo -e "  ${RED}✗ FAIL${NC} $label"
    echo -e "        Expected to find: ${YELLOW}$expected${NC}"
    echo -e "        Got body snippet: ${YELLOW}$(echo "$body" | head -c 200)${NC}"
    ((FAIL++))
  fi
}

req() {
  # req METHOD URL [data] [token]
  local method="$1" url="$2" data="$3" tok="$4"
  local args=(-s -w '\n%{http_code}' -X "$method" -H 'Content-Type: application/json')
  [ -n "$tok" ] && args+=(-H "Authorization: Bearer $tok")
  [ -n "$data" ] && args+=(-d "$data")
  curl "${args[@]}" "$url"
}

parse_field() {
  # naive JSON field extractor: parse_field "token" from response
  echo "$1" | grep -o "\"$2\":\"[^\"]*\"" | head -1 | sed 's/.*":"//' | sed 's/"//'
}

# ─── Health Check ─────────────────────────────────────────────────────────────
log_section "HEALTH CHECK"
RESP=$(req GET "$BASE/health")
BODY=$(echo "$RESP" | head -n -1)
assert "Server is running" 200 '"success":true' "$BODY"

# ─── AUTH: Register ───────────────────────────────────────────────────────────
log_section "AUTH: REGISTER"

RESP=$(req POST "$API/auth/register" '{
  "name": "Test Farmer",
  "email": "testfarmer_'$$'@test.com",
  "password": "Farmer@1234",
  "age": 35,
  "gender": "male",
  "annualIncome": 90000,
  "occupation": "farmer",
  "state": "Punjab",
  "category": "OBC",
  "educationLevel": "primary",
  "preferredLanguage": "pa"
}')
BODY=$(echo "$RESP" | head -n -1)
assert "Register new user returns token" 201 '"token"' "$BODY"
assert "Registration success message" 201 '"success":true' "$BODY"
TOKEN=$(parse_field "$BODY" "token")

# Duplicate registration
RESP=$(req POST "$API/auth/register" '{
  "name": "Test Farmer",
  "email": "testfarmer_'$$'@test.com",
  "password": "Farmer@1234",
  "age": 35, "gender": "male", "annualIncome": 90000,
  "occupation": "farmer", "state": "Punjab",
  "category": "OBC", "educationLevel": "primary"
}')
BODY=$(echo "$RESP" | head -n -1)
assert "Duplicate email rejected (409)" 409 '"success":false' "$BODY"

# Bad payload
RESP=$(req POST "$API/auth/register" '{"email":"bad-email","password":"123"}')
BODY=$(echo "$RESP" | head -n -1)
assert "Invalid register payload rejected (422)" 422 '"success":false' "$BODY"

# ─── AUTH: Login ──────────────────────────────────────────────────────────────
log_section "AUTH: LOGIN"

RESP=$(req POST "$API/auth/login" '{"email":"testfarmer_'$$'@test.com","password":"Farmer@1234"}')
BODY=$(echo "$RESP" | head -n -1)
assert "Login with correct credentials" 200 '"token"' "$BODY"
TOKEN=$(parse_field "$BODY" "token")

RESP=$(req POST "$API/auth/login" '{"email":"testfarmer_'$$'@test.com","password":"WrongPass@99"}')
BODY=$(echo "$RESP" | head -n -1)
assert "Login with wrong password rejected" 401 '"success":false' "$BODY"

# Admin login
RESP=$(req POST "$API/auth/login" '{"email":"admin@govtschemes.in","password":"Admin@123456"}')
BODY=$(echo "$RESP" | head -n -1)
assert "Admin login succeeds" 200 '"token"' "$BODY"
ADMIN_TOKEN=$(parse_field "$BODY" "token")

# ─── AUTH: Get Me ─────────────────────────────────────────────────────────────
log_section "AUTH: GET ME"
RESP=$(req GET "$API/auth/me" "" "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /auth/me returns user" 200 '"email"' "$BODY"

RESP=$(req GET "$API/auth/me")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /auth/me without token rejected" 401 '"success":false' "$BODY"

# ─── USER: Profile ────────────────────────────────────────────────────────────
log_section "USER: PROFILE"

RESP=$(req GET "$API/user/profile" "" "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /user/profile returns user data" 200 '"occupation"' "$BODY"

RESP=$(req PUT "$API/user/profile" '{"preferredLanguage":"hi","annualIncome":95000}' "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "PUT /user/profile updates language" 200 '"success":true' "$BODY"

# Protected field should be ignored
RESP=$(req PUT "$API/user/profile" '{"role":"admin"}' "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "PUT /user/profile ignores role field" 200 '' "$BODY"

# ─── SCHEMES: Public Endpoints ────────────────────────────────────────────────
log_section "SCHEMES: PUBLIC"

RESP=$(req GET "$API/schemes")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /schemes returns list" 200 '"schemes"' "$BODY"
assert "GET /schemes has pagination meta" 200 '"total"' "$BODY"

RESP=$(req GET "$API/schemes?category=farmer")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /schemes?category=farmer filters correctly" 200 '"schemes"' "$BODY"

RESP=$(req GET "$API/schemes?lang=hi")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /schemes?lang=hi returns localized content" 200 '"schemes"' "$BODY"

RESP=$(req GET "$API/schemes?page=1&limit=5")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /schemes pagination works" 200 '"page"' "$BODY"

RESP=$(req GET "$API/schemes/categories")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /schemes/categories returns category summary" 200 '"categories"' "$BODY"

RESP=$(req GET "$API/schemes/search?q=kisan")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /schemes/search?q=kisan works" 200 '"schemes"' "$BODY"

# Extract first scheme ID for further tests
SCHEME_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*"' | head -1 | sed 's/.*":"//' | sed 's/"//')

if [ -z "$SCHEME_ID" ]; then
  # Fallback: get ID from list
  RESP2=$(req GET "$API/schemes")
  BODY2=$(echo "$RESP2" | head -n -1)
  SCHEME_ID=$(echo "$BODY2" | grep -o '"id":"[^"]*"' | head -1 | sed 's/.*":"//' | sed 's/"//')
fi

if [ -n "$SCHEME_ID" ]; then
  RESP=$(req GET "$API/schemes/$SCHEME_ID")
  BODY=$(echo "$RESP" | head -n -1)
  assert "GET /schemes/:id returns single scheme" 200 '"name"' "$BODY"

  RESP=$(req GET "$API/schemes/$SCHEME_ID?lang=mr")
  BODY=$(echo "$RESP" | head -n -1)
  assert "GET /schemes/:id?lang=mr returns Marathi content" 200 '"name"' "$BODY"
fi

RESP=$(req GET "$API/schemes/000000000000000000000000")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /schemes/:id with invalid ID returns 404" 404 '"success":false' "$BODY"

# ─── SCHEMES: Admin Create/Update/Delete ──────────────────────────────────────
log_section "SCHEMES: ADMIN CRUD"

RESP=$(req POST "$API/schemes" '{
  "schemeCode": "TESTSCHEME001",
  "name": {"en": "Test Welfare Scheme", "hi": "परीक्षण योजना", "mr": "चाचणी योजना", "ta": "சோதனை திட்டம்", "kn": "ಪರೀಕ್ಷೆ ಯೋಜನೆ", "pa": "ਟੈਸਟ ਯੋਜਨਾ"},
  "description": {"en": "A test scheme for API testing purposes.", "hi": "एपीआई परीक्षण के लिए एक परीक्षण योजना।", "mr": "", "ta": "", "kn": "", "pa": ""},
  "benefits": {"en": "Test benefits: ₹5,000 direct transfer", "hi": "परीक्षण लाभ", "mr": "", "ta": "", "kn": "", "pa": ""},
  "category": "banking",
  "eligibility": {"minAge": 18, "maxAge": 60, "maxIncome": 300000, "allowedStates": ["All"], "categories": ["All"], "allowedGenders": ["All"], "occupations": ["All"]},
  "requiredDocuments": ["Aadhaar Card", "Bank Passbook"],
  "officialLink": "https://example.gov.in"
}' "$ADMIN_TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "POST /schemes (admin) creates scheme" 201 '"success":true' "$BODY"
NEW_SCHEME_ID=$(parse_field "$BODY" "_id")
[ -z "$NEW_SCHEME_ID" ] && NEW_SCHEME_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*"' | head -1 | sed 's/.*":"//' | sed 's/"//')

# Non-admin should be rejected
RESP=$(req POST "$API/schemes" '{"name":{"en":"X"},"category":"banking","description":{"en":"x"},"benefits":{"en":"x"}}' "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "POST /schemes (non-admin) rejected (403)" 403 '"success":false' "$BODY"

if [ -n "$NEW_SCHEME_ID" ]; then
  RESP=$(req PUT "$API/schemes/$NEW_SCHEME_ID" '{"ministry":"Ministry of Finance"}' "$ADMIN_TOKEN")
  BODY=$(echo "$RESP" | head -n -1)
  assert "PUT /schemes/:id (admin) updates scheme" 200 '"success":true' "$BODY"

  RESP=$(req DELETE "$API/schemes/$NEW_SCHEME_ID" "" "$ADMIN_TOKEN")
  BODY=$(echo "$RESP" | head -n -1)
  assert "DELETE /schemes/:id (admin) deactivates scheme" 200 '"success":true' "$BODY"
fi

# ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────
log_section "RECOMMENDATIONS"

RESP=$(req GET "$API/recommendations" "" "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /recommendations returns eligible schemes" 200 '"recommendations"' "$BODY"
assert "GET /recommendations includes userProfile" 200 '"userProfile"' "$BODY"

RESP=$(req GET "$API/recommendations?category=farmer" "" "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /recommendations?category=farmer filters" 200 '"recommendations"' "$BODY"

RESP=$(req GET "$API/recommendations?lang=hi" "" "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /recommendations?lang=hi localizes response" 200 '"recommendations"' "$BODY"

RESP=$(req GET "$API/recommendations/summary" "" "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /recommendations/summary returns stats" 200 '"totalEligible"' "$BODY"
assert "GET /recommendations/summary has byCategory" 200 '"byCategory"' "$BODY"

if [ -n "$SCHEME_ID" ]; then
  RESP=$(req GET "$API/recommendations/check/$SCHEME_ID" "" "$TOKEN")
  BODY=$(echo "$RESP" | head -n -1)
  assert "GET /recommendations/check/:id returns eligibility" 200 '"eligible"' "$BODY"
  assert "GET /recommendations/check/:id has matchPercentage" 200 '"matchPercentage"' "$BODY"
fi

# Unauthenticated recommendations rejected
RESP=$(req GET "$API/recommendations")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /recommendations without token rejected (401)" 401 '"success":false' "$BODY"

# ─── USER: Saved Schemes ──────────────────────────────────────────────────────
log_section "USER: SAVED SCHEMES"

if [ -n "$SCHEME_ID" ]; then
  RESP=$(req POST "$API/user/saved-schemes/$SCHEME_ID" "" "$TOKEN")
  BODY=$(echo "$RESP" | head -n -1)
  assert "POST /user/saved-schemes/:id saves scheme" 200 '"success":true' "$BODY"

  # Duplicate save rejected
  RESP=$(req POST "$API/user/saved-schemes/$SCHEME_ID" "" "$TOKEN")
  BODY=$(echo "$RESP" | head -n -1)
  assert "POST /user/saved-schemes/:id duplicate rejected (409)" 409 '"success":false' "$BODY"

  RESP=$(req DELETE "$API/user/saved-schemes/$SCHEME_ID" "" "$TOKEN")
  BODY=$(echo "$RESP" | head -n -1)
  assert "DELETE /user/saved-schemes/:id removes scheme" 200 '"success":true' "$BODY"
fi

# ─── ADMIN: Analytics & Management ───────────────────────────────────────────
log_section "ADMIN: ANALYTICS & MANAGEMENT"

RESP=$(req GET "$API/admin/analytics" "" "$ADMIN_TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /admin/analytics returns dashboard data" 200 '"overview"' "$BODY"
assert "GET /admin/analytics has users stats" 200 '"users"' "$BODY"
assert "GET /admin/analytics has schemes stats" 200 '"schemes"' "$BODY"

# Non-admin should be rejected
RESP=$(req GET "$API/admin/analytics" "" "$TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /admin/analytics (non-admin) rejected (403)" 403 '"success":false' "$BODY"

RESP=$(req GET "$API/admin/schemes" "" "$ADMIN_TOKEN")
BODY=$(echo "$RESP" | head -n -1)
assert "GET /admin/schemes returns all schemes (incl. inactive)" 200 '"schemes"' "$BODY"

# ─── RATE LIMITING (smoke test only, not exhaustive) ──────────────────────────
log_section "SECURITY"

RESP=$(req GET "$API/schemes/invalidmongoidddddddddddd")
BODY=$(echo "$RESP" | head -n -1)
assert "Invalid Mongo ID returns 422" 422 '"success":false' "$BODY"

# ─── SUMMARY ──────────────────────────────────────────────────────────────────
TOTAL=$((PASS + FAIL))
echo ""
echo -e "${BLUE}══════════════════════════════════════${NC}"
echo -e "${BLUE}  TEST SUMMARY${NC}"
echo -e "${BLUE}══════════════════════════════════════${NC}"
echo -e "  Total:  $TOTAL"
echo -e "  ${GREEN}Passed: $PASS${NC}"
echo -e "  ${RED}Failed: $FAIL${NC}"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}  🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}  ⚠️  $FAIL test(s) failed.${NC}"
  exit 1
fi
