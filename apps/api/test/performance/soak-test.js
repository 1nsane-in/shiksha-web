import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, HEADERS } from './config.js';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '5m', target: 30 },   // ramp up
    { duration: '30m', target: 30 },  // sustained
    { duration: '5m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<6000'],
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
  const ep = endpoints[Math.floor(Math.random() * endpoints.length)];

  group(ep.name, function () {
    const res = http.get(ep.url, { headers: HEADERS });
    check(res, { 'status is 200': (r) => r.status === 200 });
    failureRate.add(res.status !== 200);
  });

  sleep(1); // gentle pace for long duration
}
