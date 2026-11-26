// Per-endpoint latency audit.
//
// One request per endpoint per iteration, tagged with `name`, so k6's
// end-of-test summary prints p50/p90/p95/max *per endpoint*:
//
//   BASE_URL=https://api-staging.example k6 run test/performance/audit-test.js
//   BASE_URL=... k6 run --summary-export=audit.json test/performance/audit-test.js
//
// IDs for :param routes come from env (unset = route skipped, printed at start).
// Writes are opt-in (WRITE_TESTS=1) so a run does not pollute the database.
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, getToken, ADMIN_EMAIL, ADMIN_PASSWORD } from './config.js';

const WRITE = __ENV.WRITE_TESTS === '1';
const ITERATIONS = parseInt(__ENV.ITERATIONS || '5');

const ids = {
  university: __ENV.UNIVERSITY_ID,
  application: __ENV.APPLICATION_ID,
  exam: __ENV.EXAM_ID,
  ticket: __ENV.TICKET_ID,
  student: __ENV.STUDENT_ID,
  payment: __ENV.PAYMENT_ID,
  admin: __ENV.ADMIN_ID,
  course: __ENV.COURSE_ID,
  document: __ENV.DOCUMENT_ID,
};

// [method, path, role, body?] — roles: public | student | admin
export const endpoints = [
  ['GET', '/health', 'public'],
  ['GET', '/', 'public'],
  ['GET', '/gallery', 'public'],
  ['GET', '/universities', 'public'],
  ['GET', '/universities?limit=50', 'public'],
  ['GET', '/universities/countries', 'public'],
  ['GET', '/universities/:university', 'public'],
  ['GET', '/universities/:university/brochure', 'public'],
  ['GET', '/courses', 'public'],
  ['GET', '/courses/:course', 'public'],
  ['GET', '/sections', 'public'],
  ['GET', '/sections/:course', 'public'],

  ['GET', '/auth/me', 'student'],
  ['GET', '/student/profile', 'student'],
  ['GET', '/student/stage', 'student'],
  ['GET', '/student/applications', 'student'],
  ['GET', '/student/applications/:application', 'student'],
  ['GET', '/student/documents', 'student'],
  ['GET', '/student/documents/types', 'student'],
  ['GET', '/student/dashboard/overview', 'student'],
  ['GET', '/student/dashboard/activity', 'student'],
  ['GET', '/student/dashboard/next-steps', 'student'],
  ['GET', '/payments/history', 'student'],
  ['GET', '/payments/config', 'student'],
  ['GET', '/exams/my', 'student'],
  ['GET', '/tickets/my', 'student'],
  ['GET', '/parents/children', 'student'],
  ['GET', '/timeline/my', 'student'],
  ['GET', '/letters/admission/my', 'student'],
  ['GET', '/letters/invitation/my', 'student'],
  ['GET', '/visa-support', 'student'],
  ['GET', '/notifications', 'student'],

  ['GET', '/admin/dashboard', 'admin'],
  ['GET', '/admin/students', 'admin'],
  ['GET', '/admin/students?page=1&limit=20', 'admin'],
  ['GET', '/admin/students/stats', 'admin'],
  ['GET', '/admin/students/:student', 'admin'],
  ['GET', '/admin/applications', 'admin'],
  ['GET', '/admin/applications/:application', 'admin'],
  ['GET', '/admin/documents/pending', 'admin'],
  ['GET', '/admin/documents/types', 'admin'],
  ['GET', '/admin/universities', 'admin'],
  ['GET', '/admin/universities/statistics', 'admin'],
  ['GET', '/admin/universities/:university', 'admin'],
  ['GET', '/admin/exams', 'admin'],
  ['GET', '/admin/exams/:exam', 'admin'],
  ['GET', '/consultations', 'admin'],
  ['GET', '/payments/admin/pending', 'admin'],
  ['GET', '/tickets/admin/all', 'admin'],
  ['GET', '/auth/me', 'admin'],
];

const writes = [
  ['POST', '/consultations', 'public', { name: 'Load Test', email: 'load@test.local', phone: '9999999999', message: 'k6 audit' }],
];

export const options = {
  scenarios: {
    audit: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: ITERATIONS,
      maxDuration: '10m',
    },
  },
  thresholds: {
    // 404/403 on unseeded IDs should not fail the run silently, but 5xx must.
    http_req_failed: ['rate<0.05'],
  },
};

function resolve(path) {
  const missing = [];
  const url = path.replace(/:([a-zA-Z]+)/g, (_, key) => {
    if (!ids[key]) missing.push(key);
    return ids[key] || key;
  });
  return missing.length ? null : url;
}

export function setup() {
  // Login once for the whole run; ?mobile=true returns a Bearer token because
  // the web flow only gets an httpOnly cookie.
  const admin = getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  const student = getToken(
    __ENV.STUDENT_EMAIL || 'student@example.com',
    __ENV.STUDENT_PASSWORD || 'test123',
  );

  const skipped = endpoints
    .map(([, path]) => path)
    .filter((path) => path.includes(':') && !resolve(path));
  if (skipped.length) {
    console.log(`skipped (missing ids): ${skipped.join(', ')}`);
  }
  return { admin, student };
}

export default function (data) {
  // Login is measured too (throttled server-side, so one call per iteration).
  const login = http.post(
    `${BASE_URL}/auth/login?mobile=true`,
    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'POST /auth/login' },
    },
  );
  check(login, { 'login < 500': (r) => r.status < 500 });

  const list = WRITE ? endpoints.concat(writes) : endpoints;

  for (const [method, rawPath, role, body] of list) {
    const path = resolve(rawPath);
    if (!path) continue;

    const headers = { 'Content-Type': 'application/json' };
    if (role === 'admin') {
      headers.Authorization = `Bearer ${data.admin}`;
    } else if (role === 'student') {
      headers.Authorization = `Bearer ${data.student}`;
    }

    const res = http.request(method, `${BASE_URL}${path}`, body ? JSON.stringify(body) : null, {
      headers,
      tags: { name: `${method} ${rawPath}` },
    });

    check(res, {
      [`${method} ${rawPath} < 500`]: (r) => r.status < 500,
    });
    sleep(0.05);
  }
}
