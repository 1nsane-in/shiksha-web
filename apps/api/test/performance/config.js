import http from 'k6/http';

// ── Environment ──────────────────────────────────────────────
// All config is driven by env vars with sensible local-dev defaults.
// Override any via `k6 run -e KEY=VAL ...` or prefix the shell command.

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Auth credentials for admin and student roles
export const ADMIN_EMAIL = __ENV.ADMIN_EMAIL || 'admin@example.com';
export const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || 'test123';
export const STUDENT_EMAIL = __ENV.STUDENT_EMAIL || 'student@example.com';
export const STUDENT_PASSWORD = __ENV.STUDENT_PASSWORD || 'test123';

// Test durations — override per environment
export const DURATION_SMOKE  = __ENV.DURATION_SMOKE  || '10s';
export const DURATION_LOAD   = __ENV.DURATION_LOAD   || '3m';
export const DURATION_STRESS = __ENV.DURATION_STRESS || '8m';
export const DURATION_SPIKE  = __ENV.DURATION_SPIKE  || '3m';
export const DURATION_SOAK   = __ENV.DURATION_SOAK   || '40m';

// Virtual users per test type
export const VUS_LOAD = parseInt(__ENV.VUS_LOAD || '50');
export const VUS_SOAK = parseInt(__ENV.VUS_SOAK || '30');

// ── Helpers ──────────────────────────────────────────────────

export const HEADERS = { 'Content-Type': 'application/json' };

/** Authenticated request headers. */
export function makeHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

/** Auto-detect localhost — useful for conditional logic. */
export function isLocal() {
  return BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1');
}

/** Login for any role. Returns the access token. */
export function getToken(email, password) {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    { headers: HEADERS },
  );
  const body = JSON.parse(res.body);
  return body.accessToken;
}
