import http from 'k6/http';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
export const ADMIN_EMAIL = __ENV.ADMIN_EMAIL || 'admin@example.com';
export const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || 'test123';
export const STUDENT_EMAIL = __ENV.STUDENT_EMAIL || 'student@example.com';
export const STUDENT_PASSWORD = __ENV.STUDENT_PASSWORD || 'test123';

export const HEADERS = { 'Content-Type': 'application/json' };

// ponytail: single login function, works for any role
export function getToken(email, password) {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    { headers: HEADERS },
  );
  const body = JSON.parse(res.body);
  return body.accessToken;
}
