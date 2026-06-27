import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, HEADERS } from './config.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<5000'], // relaxed for smoke
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  // Shared auth token — logged in once and reused
  const token = getAdminToken();

  group('public endpoints', function () {
    let res;

    res = http.get(`${BASE_URL}/health`, { headers: HEADERS });
    check(res, { 'health is 200': (r) => r.status === 200 });
    sleep(0.5);

    res = http.get(`${BASE_URL}/gallery`, { headers: HEADERS });
    check(res, { 'gallery is 200': (r) => r.status === 200 });
    sleep(0.5);

    res = http.get(`${BASE_URL}/universities`, { headers: HEADERS });
    check(res, { 'universities is 200': (r) => r.status === 200 });
    sleep(0.5);

    res = http.get(`${BASE_URL}/universities/countries`, { headers: HEADERS });
    check(res, { 'countries is 200': (r) => r.status === 200 });
    sleep(0.5);

    res = http.get(`${BASE_URL}/sections`, { headers: HEADERS });
    check(res, { 'sections is 200': (r) => r.status === 200 });
    sleep(0.5);
  });

  group('auth endpoints', function () {
    const res = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
      { headers: HEADERS },
    );
    check(res, { 'login is 200': (r) => r.status === 200 });
    sleep(0.5);
  });

  group('admin endpoints', function () {
    var adminHeaders = JSON.parse(JSON.stringify(HEADERS));
    adminHeaders.Authorization = 'Bearer ' + token;

    const res = http.get(`${BASE_URL}/consultations`, {
      headers: adminHeaders,
    });
    check(res, { 'consultations is 200': (r) => r.status === 200 });
    sleep(0.5);
  });
}

function getAdminToken() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    { headers: HEADERS },
  );
  return JSON.parse(res.body).accessToken;
}
