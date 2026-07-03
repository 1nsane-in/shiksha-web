import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, HEADERS } from './config.js';

const failureRate = new Rate('failed_requests');
const requestDuration = new Trend('request_duration');

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // ramp up
    { duration: '2m', target: 50 },   // stay
    { duration: '30s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
    failed_requests: ['rate<0.01'],
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
  // Randomize which endpoint we hit to avoid caching bias
  const ep = endpoints[Math.floor(Math.random() * endpoints.length)];

  group(ep.name, function () {
    const res = http.get(ep.url, { headers: HEADERS });
    check(res, { 'status is 200': (r) => r.status === 200 });
    failureRate.add(res.status !== 200);
    requestDuration.add(res.timings.duration);
  });

  sleep(0.3); // stagger requests slightly
}
