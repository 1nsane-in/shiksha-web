import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  duration: '3s',
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<1.0'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/health`);
  const ok = check(res, { 'status is 200': (r) => r.status === 200 });

  if (ok) {
    console.log(`✅ Server is healthy at ${BASE_URL}`);
  } else {
    console.log(`❌ Server unreachable at ${BASE_URL} (got status ${res.status})`);
  }
}
