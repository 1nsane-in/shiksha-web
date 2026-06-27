import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, HEADERS } from './config.js';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '1m', target: 5 },    // low baseline
    { duration: '10s', target: 300 }, // SPIKE!
    { duration: '2m', target: 0 },    // cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000', 'p(99)<10000'],
    http_req_failed: ['rate<0.05'],
    failed_requests: ['rate<0.05'],
  },
};

const endpoints = [
  { name: 'health', url: `${BASE_URL}/health` },
  { name: 'gallery', url: `${BASE_URL}/gallery` },
  { name: 'universities', url: `${BASE_URL}/universities` },
  { name: 'countries', url: `${BASE_URL}/universities/countries` },
  { name: 'sections', url: `${BASE_URL}/sections` },
  { name: 'courses', url: `${BASE_URL}/courses` },
];

export default function () {
  const ep = endpoints[Math.floor(Math.random() * endpoints.length)];

  group(ep.name, function () {
    const res = http.get(ep.url, { headers: HEADERS });
    check(res, { 'status is 200': (r) => r.status === 200 });
    failureRate.add(res.status !== 200);
  });

  // No sleep during spike — fire as fast as possible
}
