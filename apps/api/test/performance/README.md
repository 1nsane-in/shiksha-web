# Performance Testing with k6

Load, stress, spike, and soak tests for the Shiksha Platform API using [k6](https://k6.io).

## Prerequisites

- [k6](https://k6.io/docs/get-started/installation/) installed (`k6 version`)
- The API server running at `BASE_URL` (default `http://localhost:3000`)

### Installing k6

| Platform | Command |
|----------|---------|
| macOS    | `brew install k6` |
| Linux    | `sudo apt install k6` or `snap install k6` |
| Windows  | `winget install k6` or download from [k6.io](https://k6.io/docs/get-started/installation/) |

Or run `node test/performance/setup.js` for interactive setup with per-platform guidance.

## Quick Start

```bash
# 1. Install k6 (see above)

# 2. Create env file (optional — defaults work for local dev)
cp .env.example .env.perf
# Edit .env.perf if your server runs on a different URL/port

# 3. Health check
npm run test:perf:check

# 4. Run all tests sequentially
bash test/performance/run-all.sh

# 5. Run individual tests
npm run test:perf:smoke   # quick smoke test
npm run test:perf:load    # sustained load (3 min)
npm run test:perf:spike   # sudden traffic spike
npm run test:perf:stress  # ramped stress test
npm run test:perf:soak    # long-duration soak (40 min)
```

## Test Types

| Test | What it does | Duration | VUs | Threshold |
|------|-------------|----------|-----|-----------|
| **smoke** | Verify basic functionality with minimal load | 10s | 1 | p(95) < 5s |
| **load** | Sustained average traffic to find baseline perf | 3m | 50 | p(95) < 2s |
| **spike** | Sudden burst of traffic to test auto-scaling | 3m | 5→300 | p(95) < 5s |
| **stress** | Gradual ramp to breaking point to find limits | 8m | 20→200 | p(95) < 3s |
| **soak** | Extended run to detect memory leaks / degradation | 40m | 30 | p(95) < 3s |

### When to run each

- **Smoke**: CI pipeline, after every deploy
- **Load**: Before release, after significant changes
- **Spike**: If you use auto-scaling (K8s HPA, serverless)
- **Stress**: To find the system's breaking point
- **Soak**: Overnight / weekly to catch slow leaks

## Running Against Different Environments

```bash
# Local (default)
npm run test:perf:smoke

# Staging
BASE_URL=https://staging-api.example.com npm run test:perf:load

# Production (read-only endpoints only!)
BASE_URL=https://api.example.com k6 run test/performance/smoke-test.js -e BASE_URL=https://api.example.com
```

For the full pipeline against a different URL:

```bash
BASE_URL=https://staging-api.example.com bash test/performance/run-all.sh
```

Or pass additional k6 env vars:

```bash
bash test/performance/run-all.sh -e BASE_URL=https://staging-api.example.com -e K6_OUT=json=results.json
```

## Expected Results

Under normal conditions on a local dev machine:

| Endpoint | Avg latency | p(95) | p(99) |
|----------|------------|-------|-------|
| `/health` | < 10ms | < 20ms | < 50ms |
| `/gallery` | < 100ms | < 300ms | < 500ms |
| `/universities` | < 200ms | < 500ms | < 1000ms |

These will vary by environment. Run smoke tests against each environment to establish baselines.

## Thresholds

Tests fail (exit code 1) if any threshold is crossed. Thresholds are defined per-test in each script and in `thresholds.json` for shared reference.

| Metric | Threshold | Meaning |
|--------|-----------|---------|
| `http_req_duration` | p(95) < 2000ms | 95% of requests complete within 2s |
| `http_req_duration` | p(99) < 5000ms | 99% within 5s |
| `http_req_failed` | rate < 0.01 | Fewer than 1% of requests fail |

Tighten thresholds for production, relax for CI if the test runner is on a shared box.

## Adding New Endpoints

1. Add the endpoint URL to the `endpoints` array in each test script
2. If it needs auth, add an authenticated call using `makeHeaders(token)`:

```javascript
import { BASE_URL, getToken, makeHeaders } from './config.js';

const token = getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
const res = http.get(`${BASE_URL}/some-protected-route`, {
  headers: makeHeaders(token),
});
```

3. For POST/DELETE, add a `group` block:

```javascript
group('create item', function () {
  const res = http.post(`${BASE_URL}/items`, JSON.stringify({ name: 'test' }), {
    headers: makeHeaders(token),
  });
  check(res, { 'create is 201': (r) => r.status === 201 });
});
```

## Interpreting Results

Key metrics from the k6 output:

```
http_req_duration..........: avg=45ms   min=2ms   med=30ms   max=500ms  p(90)=100ms  p(95)=200ms
http_req_failed............: 0.00%   ✓ 0   ✗ 0
http_reqs..................: 1500   50.0/s
vus........................: 50     min=1     max=50
```

- **avg/med**: Typical response time. Med < 200ms is good.
- **p(95)**: 95th percentile. This is your SLA number.
- **p(99)**: 99th percentile. Tail latency — watch for outliers.
- **http_req_failed**: Should be near 0%.
- **http_reqs**: Throughput in requests/second.

### Common issues

| Symptom | Likely cause |
|---------|-------------|
| p(95) climbs during soak | Memory leak or connection pool exhaustion |
| Failures at high concurrency | DB connection pool too small |
| Spike causes timeouts | Missing connection pooling or rate limiter |
| First request slow | Cold start (lazy initialization) |

## Local vs CI Usage

**Local development:**
```bash
npm run test:perf:check    # quick health check
npm run test:perf:smoke    # sanity check after changes
```

**CI pipeline (smoke only — fast):**
```yaml
- run: k6 run test/performance/smoke-test.js
```

**CI pipeline (full suite — nightly):**
```yaml
- run: bash test/performance/run-all.sh
```

**CI pipeline (staging — on every PR):**
```yaml
- run: k6 run test/performance/load-test.js
```

## Files

```
test/performance/
├── .env.example        # Example env vars
├── README.md           # This file
├── config.js           # Shared k6 config & helpers
├── thresholds.json     # Shared threshold reference
├── setup.js            # Node.js setup script (not k6)
├── check-health.js     # k6 health check guard
├── smoke-test.js       # 10s, 1 VU — basic sanity
├── load-test.js        # 3m, 50 VU — sustained load
├── stress-test.js      # 8m, 20→200 VU — breaking point
├── spike-test.js       # 3m, 5→300 VU — sudden burst
├── soak-test.js        # 40m, 30 VU — endurance
└── run-all.sh          # Full pipeline runner
```
