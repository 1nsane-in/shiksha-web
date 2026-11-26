# Security Fixes — Action Plan

Date: 2026-11-18
Scope: NestJS API (`apps/api`) + Next.js web (`apps/web`)
Method: static code review (not a penetration test)
Status: P0 code fixes implemented 2026-11-25 — ops actions, P1/P2 and test debt still OPEN (see §6)

> Supersedes the open items in `docs/07-security/SECURITY_AUDIT_REPORT.md` where they overlap.
> Some older findings are already fixed (helmet, CORS allowlist, rate limiting, account lockout,
> request-body validation, static-upload removal, refresh-token hashing). Do not re-apply blindly.

Legend: severity = impact if exploited. `P0` = do this week, `P1` = 2 weeks, `P2` = hardening.

---

## 1. Findings

### P0 — Critical / High

#### FIND-001 — Access token stored in JS-readable cookie
- Location: `apps/web/stores/auth-store.ts:9`
- Evidence: `document.cookie = \`token=${token}; path=/; max-age=...; SameSite=Lax\``
- Impact: Any XSS (dependency, stored SVG, injected script) reads `token` and takes over the
  account, including payments, documents and letters. `HttpOnly` is the only browser-level defense.
- Fix:
  - Set the access token as `HttpOnly; Secure; SameSite=Lax` (or `Strict`) from the API.
  - Next.js middleware can read `httpOnly` cookies server-side; keep using that for route gating.
  - Do not store auth tokens in `document.cookie`, `localStorage` or `sessionStorage`.
  - Keep access token TTL short (10–15 min), refresh via httpOnly refresh cookie.
- Acceptance: `grep -r "document.cookie" apps/web` returns no auth-token writes.

#### FIND-002 — Request bodies logged (passwords, OTPs, payment data)
- Location: `apps/api/src/main.ts:35-43`
- Evidence: `logger.debug(\`Request Body: ${JSON.stringify(req.body)}\`)` on every request.
  Also logs `req.originalUrl`, which includes the PayU hash in the success redirect query string.
- Impact: Credentials and OTPs written to logs and log aggregator. Log access = account takeover.
- Fix:
  - Production: no request bodies. Log allowlisted metadata only: method, route pattern,
    status, duration, request id.
  - Development (`env.isDev`): request bodies may be logged, with fields matching
    `password|otp|token|secret|hash|authorization|cookie|cvv|card` replaced by `[REDACTED]`.
  - Raw unredacted bodies in dev only via explicit `LOG_BODIES_RAW=true`. Never set in prod.
  - Use `req.path` (no query string) in access logs; never log tokens, OTPs, cookies,
    authorization headers or full Google profile payloads.
- Acceptance: login request produces no password/OTP string in logs in either environment.

#### FIND-003 — Object keys use original filename (overwrite + predictable URLs)
- Location: `apps/api/src/common/services/storage.service.ts:43-44`
- Evidence: `key = \`${folder}/${sanitizedOriginalName}\``
- Impact: Student A uploading `passport.pdf` overwrites Student B's file. Keys are guessable
  if any bucket is public.
- Fix:
  - `key = \`${folder}/${userId}/${crypto.randomUUID()}${ext}\`` (owner-scoped, random).
  - Never overwrite an existing key; fail or generate a new one.
  - Preserve extension only, never the full original name in the key.
- Acceptance: two uploads with the same filename produce two distinct keys.

#### FIND-004 — Document upload trusts client-supplied metadata
- Location: `apps/api/src/documents/documents.service.ts:32-97`
- Evidence: `uploadDocument` stores `dto.fileUrl`, `dto.fileName`, `dto.fileSize` as sent by the client.
- Impact:
  - Student can point an admin's browser at an arbitrary URL (phishing/tracking/beacon).
  - Student can reference another student's file URL.
  - Public inline SVG = stored XSS on the storage domain.
- Fix:
  - Server issues a presigned upload URL for a server-generated key bound to `studentId`.
  - Client uploads directly to storage; API stores only the key.
  - On read, API resolves a short-lived signed URL after ownership check.
  - Validate content by magic bytes, not `file.mimetype`.
  - Remove SVG from document uploads (or force `Content-Disposition: attachment` from a
    separate cookieless domain).
- Acceptance: API rejects `fileUrl` in request body; document row stores a server-generated key.

#### FIND-005 — Public storage URL used for private documents
- Location: `apps/api/src/common/services/storage.service.ts:54-56, 86-90`
- Evidence: if `R2_PUBLIC_URL` is set, `upload()`/`getFileUrl()` return a permanent public URL.
- Impact: Passport/medical documents permanently public if the bucket is public. Violates
  `AGENTS.md` rule "documents in private object storage, signed URLs only".
- Fix:
  - Two buckets: `public` (marketing assets only) and `private` (documents, letters, IDs).
  - `R2_PUBLIC_URL` only for the public bucket. All document endpoints use signed URLs
    (5–15 min TTL) and log access.
- Acceptance: anonymous request to a document URL returns 403.

#### FIND-006 — Payment confirmation has no webhook / server-to-server source of truth
- Location: `apps/api/src/payments/payments.controller.ts:41-46`,
  `apps/api/src/payments/payments.service.ts:135-190`,
  `apps/web/app/(shared)/payments/success/route.ts`
- Evidence: `POST /payments/verify` is `@Public()` and browser-driven. Hash is verified
  server-side (good), but:
  - no PayU webhook/S2S confirmation,
  - no `dto.amount === payment.amount` cross-check,
  - no status-transition guard (a replayed `success` can re-mark a record),
  - no idempotency/replay storage keyed by `txnid`,
  - no settlement reconciliation.
- Impact: Payment state depends on a browser round-trip. Replay, duplicate crediting, or
  marking a stale/failed payment successful. Manual-approval path becomes the only reliable one.
- Fix:
  - Add PayU webhook / S2S verification endpoint as the source of truth.
  - Verify hash with `crypto.timingSafeEqual`.
  - Compare `dto.amount` to stored `payment.amount` and currency.
  - Guard transitions: `PENDING → SUCCESS|FAILED` only; ignore/no-op on repeat success.
  - Persist processed `txnid` for idempotency (Redis + DB).
  - Daily reconciliation against the PayU settlement report; alert on mismatch.
- Acceptance: replayed success webhook does not create a second SUCCESS/advance stage; wrong
  amount is rejected.

#### FIND-007 — Low bcrypt cost
- Location: auth, admin, parents services and `scripts/create-super-admin.ts`
- Evidence: `bcrypt.hash(password, 8)` in all password-creation paths
- Impact: Cheap offline cracking if the DB leaks.
- Fix: shared `PASSWORD_SALT_ROUNDS = 12` (`apps/api/src/common/constants.ts`) used by every
  hash call (auth, admin, parents, seed script). Existing hashes remain valid and upgrade on
  password change/reset; no forced logout.
- Acceptance: no `bcrypt.hash(..., 8)` remains; new hashes use cost 12; login still passes.

### P1 — Medium / High

#### FIND-008 — Swagger exposed in production
- Location: `apps/api/src/main.ts:26-31`
- Impact: Complete API map for an attacker, including admin routes.
- Fix: only mount `SwaggerModule` when `env.isDev`, or admin-guard `/api/docs`.

#### FIND-009 — No environment validation; secrets default to empty
- Location: `apps/api/src/app.module.ts:30-33`,
  `apps/api/src/payments/payments.service.ts:34-36`
- Evidence: `ConfigModule.forRoot` has no `validate`; `PAYU_SALT`/`PAYU_KEY` fall back to `''`.
- Impact: App boots misconfigured; payment hash checks become unreliable; missing `JWT_SECRET`
  only fails at first request.
- Fix:
  - Plain `validateConfig` (`apps/api/src/common/config.validation.ts`) wired into
    `ConfigModule.forRoot({ validate })` — no new dependency.
  - Prod requires: `DATABASE_URL`, `JWT_SECRET` (>=32 chars), `FRONTEND_URL`, `PAYU_KEY`,
    `PAYU_SALT`, R2 vars, Upstash Redis vars. Dev requires `DATABASE_URL`, `JWT_SECRET`.
  - Fail boot on `ENV=dev` + `NODE_ENV=production` (dev OTP bypass) and on any non-dev
    `ENV` with `NODE_ENV !== 'production'`. Local dev must set `ENV=dev`.
- Acceptance: deleting `JWT_SECRET` prevents startup with a clear error.

#### FIND-010 — OTP brute force: no per-record attempt counter
- Location: `apps/api/src/auth/auth.service.ts:416-437` (verifyOtp), 356-400 (reset OTP)
- Evidence: lookup by `email + otp` only; IP throttle is 5/min, distributed IPs bypass it.
  `devOtp` is returned when `NODE_ENV === 'development'` (lines 73-91, 117-135, 366-377, 783).
- Impact: 6-digit OTP brute-force within the 10-minute expiry; OTP leak if production ever runs
  with `NODE_ENV=development`.
- Fix:
  - `attempts` column already exists in `OtpVerification`; use it via shared
    `verifyOtpRecord` (`apps/api/src/common/helpers/otp-verification.ts`). Invalidates after 5.
  - Atomic consume: `updateMany` guarded by `verifiedAt: null, attempts < 5`.
  - Constant-time comparison (`timingSafeEqual`); never log OTP.
  - Parents phone OTP (in-memory) also locked after 5 wrong codes; removed production OTP log.
  - Dev-bypass boot guard is in `config.validation.ts` (FIND-009).
- Acceptance: 5 wrong OTPs invalidate the code; replay of a verified OTP fails.

#### FIND-011 — Refresh token rotation race and no reuse detection
- Location: `apps/api/src/auth/auth.service.ts:669-700`
- Evidence: 30-second grace window on the old token; find-then-update, not atomic; stolen old
  refresh token is replayable for 30s.
- Impact: Refresh-token replay after theft.
- Fix:
  - `UserSession` gains `familyId` + `revokedAt` (migration `20261119000000_add_session_family`).
  - `rotateRefreshSession` consumes atomically via guarded `updateMany`; replay revokes the family.
  - 30s grace window removed. Multi-tab refresh may now log out siblings — accepted tradeoff
    for reuse detection; re-add grace only if it becomes a real UX problem.
  - Logout revokes the whole family; expired rows GC'd, revoked rows kept for token lifetime.
- Acceptance: reusing a rotated refresh token revokes the family and returns 401.

#### FIND-012 — CSRF on cookie-based endpoints
- Location: `apps/api/src/auth/auth.controller.ts:62-70, 351-410`,
  `apps/api/src/main.ts:57-96`
- Evidence: prod refresh cookie is `SameSite=None`; CORS uses `credentials: true`; refresh/logout
  accept the cookie with no CSRF token or origin check.
- Impact: Login CSRF, forced logout, refresh CSRF. Bearer-protected mutations are not affected.
- Fix:
  - `CookieOriginGuard` on `AuthController`: allows only `FRONTEND_URL` origins
    (+ localhost in dev); requests with no `Origin` (mobile/curl) allowed since browsers
    always send it on cross-site POST.
  - `SameSite=None` kept for cross-site frontend.
  - `isMobile` refresh-token-in-body fallback still enabled — revisit if abused.
- Acceptance: cross-origin POST to `/auth/refresh` is rejected with 403.

#### FIND-013 — Upload limits and MIME trust
- Location: `apps/api/src/common/controllers/upload.controller.ts:26-49`,
  `apps/api/src/gallery/gallery.controller.ts:53-61`
- Evidence: 200MB limit, MIME allowlist from client header, `image/svg+xml` allowed.
- Impact: Storage/bandwidth DoS, stored XSS via SVG served inline.
- Fix: `assertFileAllowed` (`common/helpers/file-type.ts`) called centrally in
  `StorageService.upload` — magic-byte sniff, client mimetype ignored, SVG removed from all lists.
  Caps: documents/letters 15MB, images/other 8MB, gallery/video 50MB; Multer hard cap 55MB.
  Detected mime overwrites `file.mimetype` so storage writes the correct Content-Type.

#### FIND-014 — Missing Next.js security headers; type errors ignored at build
- Location: `apps/web/next.config.ts`
- Fix: add `async headers()` with:
  - `Content-Security-Policy` (at minimum `default-src 'self'`, no `unsafe-eval` in prod)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - Remove `typescript.ignoreBuildErrors` (or at least gate it to local builds only).

#### FIND-015 — No 2FA for admin accounts
- Location: admin auth (`apps/api/src/auth`, `apps/api/src/admin`)
- Impact: Admin accounts approve payments, view passports, issue letters. Password/OTP theft is
  full compromise.
- Fix (backend): RFC6238 TOTP helper (`common/helpers/totp.ts`), enrollment endpoints
  `POST /auth/mfa/setup` + `/auth/mfa/enable`, 8 hashed backup codes, and challenge-based
  `POST /auth/mfa/verify-login` using Redis (5 min). Enabled admins get `mfaRequired` on login
  instead of tokens; not-yet-enrolled admins get `mfaSetupRequired: true` (soft nudge).
- Frontend still needs QR/verify screens. Hard lockout of unenrolled admins is a separate ops
  decision (would need a bootstrap admin flow). Audit log on enable/disable pending.

#### FIND-016 — Ownership/IDOR checks not systematic
- Location: controllers under `documents`, `letters`, `applications`, `parents`, `visa-support`
- Evidence: payments check ownership in `payments.service.ts:275-298`; the same pattern is not
  uniformly applied. Prisma prevents SQL injection, not unauthorized object access.
- Fix: shared policy helper (e.g. `assertOwnedByStudent(user, resource)`) called in services,
  plus an e2e authorization matrix:
  - student A cannot read/update B's document, payment, letter, application
  - parent can read only linked students
  - role escalation endpoints reject non-super-admin
- Acceptance: authz e2e suite exists and runs in CI.

### P2 — Hardening / infrastructure

#### FIND-017 — Secrets and local credentials
- `docker-compose.yml` contains default DB/Redis/JWT secrets. Dev-only; never deploy it.
- All secrets in a secrets manager (Doppler / AWS Secrets Manager / Vault), injected at runtime.
- Rotate `JWT_SECRET`, `PAYU_KEY`, `PAYU_SALT`, DB password, R2 keys if they ever appeared in
  chat, screenshots, CI logs or a commit (history too).
- Verify `.env` is ignored (it is) and add secret scanning to pre-commit and CI.

#### FIND-018 — Database / Redis / network exposure
- Neon: separate roles for app and migrations; app role = minimum privileges (no DDL, no
  `SUPERUSER`); connection string not logged; pooled connection.
- Redis holds rate limits and login lockouts. Require auth + TLS; never expose publicly. If Redis
  is unavailable, auth lockout must fail closed.
- No database or Redis port published from production containers.
- Backups: PITR enabled, encrypted, restore drill documented.

#### FIND-019 — Edge / WAF / DDoS
- Cloudflare (or equivalent) in front of web and API: WAF managed rules, bot fight, rate limits,
  DDoS protection, origin IP hidden.
- Restrict admin routes to allowlisted IPs if operationally possible.
- Block direct access to storage origin; private bucket policy only.

#### FIND-020 — Observability leaks
- Sentry: `sendDefaultPii: false`, scrub cookies/headers/query strings, disable request-body
  capture. Alert on new error classes.
- PostHog: `person_profiles: 'identified_only'`, mask all inputs, disable session recording on
  `/auth`, `/payments`, `/documents`.
- Request logging: no bodies, no query strings, no cookies, no authorization headers.
- Immutable audit logs for admin mutations (check `Auditable` coverage across all admin
  controllers). Include actor, IP, user agent, before/after, timestamp.

#### FIND-021 — Supply chain / CI
- CI gates: `gitleaks detect`, `semgrep --config=auto`, `pnpm audit --prod --audit-level=high`,
  `trivy fs .` / image scan, lockfile enforced (`--frozen-lockfile`).
- Dependabot/Renovate for npm + base images.
- Branch protection; no direct pushes to main; deployment requires green checks.
- Node 22 (matches engines), pin base image digest, non-root container user, read-only FS.

#### FIND-022 — Compliance / product
- PCI-DSS SAQ-A: card data never touches the app; keep PayU redirect flow. Verify no PAN/CVV
  in logs or DB.
- India DPDP Act 2023: consent record, purpose limitation, data export/deletion path, retention
  policy, DPAs with PayU / Cloudflare R2 / Resend / Sentry / PostHog, breach notification runbook
  (24–72h).
- Passport/medical documents: encrypt at rest, restrict admin access, log every view/download.
- Never use production user data in dev/demo seeds.

---

## 2. Implementation checklist

### P0 (this week)
- [x] FIND-001 httpOnly access token; remove `document.cookie` token writes (2026-11-25)
  - API sets `accessToken` httpOnly cookie (path `/`, 15m, `SameSite=None; Secure` in prod,
    `Lax` in dev) alongside `refreshToken`; `JwtAuthGuard` still accepts `Authorization: Bearer`
    first (mobile/SSR) then falls back to the cookie. Logout clears it.
  - Web sends `withCredentials` only; no token in JS/localStorage. `proxy.ts` gates routes on a
    non-sensitive `auth_role` marker cookie (UX only — API enforces).
  - Added global Origin check for unsafe methods (CSRF defense for cookie auth).
- [x] FIND-002 prod: no body/query logs; dev: gated + redacted body logs (2026-11-18)
- [x] FIND-003 random owner-scoped storage keys (2026-11-25)
  - `key = ${folder}/${ownerId}/${crypto.randomUUID()}${ext}` — extension only, no original
    filename, no overwrite. Students can only upload to `documents/<their userId>/` (the
    folder is chosen server-side).
- [x] FIND-004 server-generated keys; stop trusting `fileUrl`/`fileSize` (2026-11-25)
  - Upload DTOs (`documents`, `letters`, `university documents`) now take `fileKey`; the API
    validates the folder prefix + ownership and `HeadObject`s the key before storing it.
    `forbidNonWhitelisted` rejects requests that still send `fileUrl`. Web clients send the
    server-returned `key`.
- [x] FIND-005 split public/private buckets; signed URLs for documents (2026-11-25)
  - Code supports two buckets: public assets (`gallery*`, `video-tours`, `logos`, `banners`,
    `brochures`, `avatars`) go to `R2_PUBLIC_BUCKET_NAME`; everything else stays in the private
    bucket and is served only via 1h signed URLs (`StorageService.viewUrl`/`signDeep`).
  - OPS: create a separate public bucket, set `R2_PUBLIC_BUCKET_NAME`, and make sure
    `R2_BUCKET_NAME` (private) has no public domain. A boot warning fires while they match.
  - Access logging for document views/downloads still uses the existing counters (P2).
- [x] FIND-006 PayU webhook + amount/status/idempotency checks (2026-11-25)
  - `POST /payments/webhook` (`@Public`, configured in the PayU dashboard) and the browser
    return now share one `applyPayUResult` path: constant-time hash compare
    (`crypto.timingSafeEqual`), stored-amount/currency check, atomic
    `PENDING|PROCESSING → SUCCESS|FAILED` transition via `updateMany`, replay-safe no-op on
    duplicates.
  - OPS TODO: point the PayU webhook at `/payments/webhook`, enable S2S; daily settlement
    reconciliation remains a follow-up job.
- [x] FIND-007 shared bcrypt cost 12 across all password-hash sites (2026-11-18)

### P1 (2 weeks)
- [x] FIND-008 Swagger mounted only when `env.isDev` (2026-11-18)
- [x] FIND-009 env validation + production boot guards (2026-11-18)
- [x] FIND-010 shared OTP lockout + atomic consume + no OTP logging (2026-11-18)
- [x] FIND-011 atomic refresh rotation + family reuse detection (2026-11-18)
- [x] FIND-012 origin guard on all cookie-auth routes (2026-11-18; extended 2026-11-25 to a
  global Origin check for all unsafe methods in `main.ts`, beyond `/auth/*`)
- [x] FIND-013 centralized magic-byte validation + size caps + SVG removal (2026-11-18)
- [x] FIND-014 Next.js security headers; remove `ignoreBuildErrors` (2026-11-25)
  - `apps/web/next.config.ts` now sets CSP, HSTS (prod), `X-Content-Type-Options`,
    `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`,
    `Cross-Origin-Opener-Policy: same-origin-allow-popups` (Google popup), and
    `poweredByHeader: false`. CSP is production-only (dev keeps HMR usable); requires
    `NEXT_PUBLIC_ATLAS_URL` in `frame-src` if the atlas origin changes.
  - All 95 pre-existing TypeScript errors fixed (admin university wizard types, exams types,
    landing seed data, null handling). `typescript.ignoreBuildErrors` removed — `next build`
    now fails on type errors.
- [x] FIND-015 admin TOTP backend (enroll/enable/verify + backup codes) (2026-11-18)
- [ ] FIND-016 ownership helper + authz e2e matrix

### P2
- [ ] FIND-017 secrets manager + rotation
- [ ] FIND-018 DB/Redis least privilege, private network, backup drill
- [ ] FIND-019 WAF/CDN/rate limits/origin hiding
- [ ] FIND-020 Sentry/PostHog/log redaction, audit coverage
- [ ] FIND-021 CI security gates + dependency automation
- [ ] FIND-022 DPDP/PCI documentation and runbooks

---

## 3. Verification commands

```bash
# auth token storage
grep -rn "document.cookie" apps/web/stores apps/web/lib apps/web/hooks

# request-body logging
grep -rn "JSON.stringify(req.body)\|Request Body" apps/api/src

# bcrypt cost
grep -rn "bcrypt.hash" apps/api/src/auth

# web security headers (prod build)
curl -sI http://localhost:3000/ | grep -iE "content-security-policy|strict-transport|x-frame-options"

# swagger exposure
grep -n "SwaggerModule" apps/api/src/main.ts

# storage key generation
grep -n "originalname\|randomUUID" apps/api/src/common/services/storage.service.ts

# payment webhook presence
grep -rn "webhook\|timingSafeEqual\|txnid" apps/api/src/payments

# secrets scanning (CI)
gitleaks detect --source=. --no-banner

# dependencies
cd apps/api && pnpm audit --prod --audit-level=high
cd apps/web && pnpm audit --prod --audit-level=high
```

---

## 4. Already implemented — do not regress

- Helmet + HSTS + CSP on API (`main.ts`)
- CORS allowlist with credentials
- Global `JwtAuthGuard` + `RolesGuard`
- `ValidationPipe` with `whitelist` + `forbidNonWhitelisted`
- Prisma parameterized queries (no raw SQL)
- Refresh tokens hashed SHA-256 before DB storage
- Login + password-reset account lockout via Redis
- Redis-backed throttler (multi-instance safe)
- Idempotency interceptor available (`apps/api/src/common/idempotency`)
- Audit-log interceptor available (`apps/api/src/common/interceptors/audit-log.interceptor.ts`)
- Static upload serving removed; storage service supports signed URLs
- PayU response hash verified server-side
- Next.js 16 / React 19 current; no `dangerouslySetInnerHTML` outside chart component

---

## 5. Definition of done

A finding closes only when:
1. Code change merged.
2. Acceptance check in section 1 passes.
3. Regression test added where the finding is testable (authz, payment replay, upload type,
   token refresh, OTP lockout).
4. `docs/11-security-fixes/SECURITY-FIXES.md` checkboxes updated.
5. No secrets, tokens, passwords or OTPs appear in logs after the change.

---

## 6. Open follow-ups (tracking, updated 2026-11-25)

### 6.1 Ops / infrastructure (required to close P0 acceptance in production)
- [ ] Create a dedicated public R2 bucket; set `R2_PUBLIC_BUCKET_NAME`; expose a public domain
      on that bucket only. Ensure `R2_BUCKET_NAME` (private) has **no** public domain.
      Until this is done FIND-005 acceptance ("anonymous doc URL → 403") is not met for new files.
- [ ] Migrate legacy storage rows that still hold old public URLs:
      `student_documents.file_url`, `university_documents.file_url`, admission/invitation letter
      `file_url`, and `university_applications.form_data.passportUrl/certificateUrl`.
      Re-upload or move objects to the private bucket; either way lock the old public folder.
- [ ] PayU dashboard: set webhook URL to `${API_URL}/payments/webhook`, enable S2S, and confirm
      `application/x-www-form-urlencoded` bodies are parsed and hash-verified with a live test payment.
- [ ] Mobile client: auth calls must send `?mobile=true` to receive `accessToken`/`refreshToken`
      in the response body (web no longer receives them; cookies only).
- [ ] Confirm `FRONTEND_URL` lists every web origin (CORS allowlist + CSRF Origin check + cookie
      issuance rely on it); production must be HTTPS for `SameSite=None; Secure` cookies.

### 6.2 Verification gaps (cannot be done from local dev)
- [ ] Staging smoke test end-to-end: login → `accessToken` httpOnly cookie → `/auth/me` →
      refresh rotation → logout clears both cookies.
- [ ] Staging upload smoke test: `POST /upload?folder=documents` → `fileKey` → `POST /documents`
      (ownership prefix + `HeadObject`) → read returns 1h signed URL → tampered `fileKey`
      (another student's folder) returns 400.
- [ ] Staging webhook smoke test: replayed success does not double-advance stage; wrong amount rejected.
- [ ] Anonymous GET against a stored document key returns 403 once the public bucket split is done.

### 6.3 Test debt
- [ ] 5 suites failing before this work (mock drift, not production bugs): `src/auth/auth.service.spec.ts`,
      `test/parents/parents.service.spec.ts`, `test/gallery/gallery.service.spec.ts`,
      `test/gallery/gallery.controller.spec.ts`, `test/students/students.controller.spec.ts`.
- [ ] Add integration tests (needs running API + test DB): cookie auth, upload `fileKey` ownership,
      PayU webhook replay/amount. Unit coverage added 2026-11-25:
      `storage.service.spec.ts`, guard cookie tests, payment replay/amount tests.

### 6.4 Code follow-ups
- [ ] Payment settlement reconciliation job against the PayU settlement report; alert on mismatch.
- [ ] Document view/download access logging (counters exist; add audit trail / signed-URL request logs).
- [ ] `auth_role` cookie is user-writable by design (routing only) — verify no UI-only authorization
      depends on it; API remains the enforcement point.
- [ ] Signed URLs expire after 1h. Any page that keeps a document URL in state longer than that will
      404/403 on click — re-fetch on click or raise TTL if UX requires.
- [ ] FIND-016 ownership/authz e2e matrix (fileKey prefix checks are done per-resource; centralize
      the helper and test the matrix).

### 6.5 Docs
- [ ] `docs/API.md`: httpOnly access cookie, `?mobile=true`, `POST /payments/webhook` contract,
      `fileKey` upload flow, `R2_PUBLIC_BUCKET_NAME`.
- [ ] Note in deployment runbook: private bucket must not have a public domain.

### 6.6 Status snapshot (2026-11-25)
- API build: clean. API tests: 544/574 pass; 30 failures all in the 5 pre-existing suites above.
- Web build: passes with type checking enabled (0 TS errors); `ignoreBuildErrors` removed.
- Web security headers verified on the standalone server (`curl -sI /` shows CSP + HSTS).
- P0 code: FIND-001/002/003/004/005/006/007 implemented, **not committed yet**.
