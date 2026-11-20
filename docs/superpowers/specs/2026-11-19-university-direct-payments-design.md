# University Direct Payments — Design Spec

- Date: 2026-11-19
- Status: DRAFT — awaiting user review
- Scope: PayU Cross-Border tuition payments to overseas universities, plus the existing INR platform fee flow.
- Location: `docs/superpowers/specs/2026-11-19-university-direct-payments-design.md`

## 1. Background / current state

- The API already uses PayU (`PAYU_KEY`, `PAYU_SALT`, `PAYU_BASE_URL`), not Razorpay. `AGENTS.md` is stale on this point. Field names in `Payment` (`razorpayOrderId`, etc.) are legacy and out of scope.
- Existing `POST /payments/initiate` takes a stage number and uses `STAGE_PAYMENT_CONFIG` with hardcoded amounts: stage 2 = ₹5,000, stage 3 = ₹10,000. Money lands in the platform's PayU merchant account. Only `STUDENT` may initiate. `PARENT` has no payment path.
- `UniversityAdmin` stores `accountNumber`, `ifscCode`, `bankCountry`, `recipientInn`, `recipientKpp`, `bankIdCode`, `bankDetails`, and `commission`. This is metadata only — no payment is routed through it today.
- `Role` enum: `SUPER_ADMIN | ADMIN | STUDENT | PARENT`. There is no university login.
- University bank accounts are abroad (Russia, Georgia, etc.); supervisors have bank details only, no online gateway.
- Desired: student or parent pays both (a) platform fee and (b) tuition that should land directly in the university's foreign account. University staff should log in and confirm receipt.

## 2. Research findings (PayU)

- PayU **Cross-Border Payments – Import** is designed for overseas merchants collecting from Indian buyers. PayU settles to the overseas merchant's native-currency account via AD banks, T+2/T+3. Source: `https://docs.payu.in/docs/introduction-cross-border-payments-import`.
- PayU is RBI-authorised as Payment Aggregator – Cross Border (PA-CB). Per-transaction cap for goods/services: ₹25,00,000.
- PayU Hosted Checkout supports LRS via `lrs_service_type` with values including `education_non_loan`. Additional LRS params: `lrs_mandatory_limit_declaration`, `lrs_tnc`, `tcs_amount`, `lrs_tcs_declaration_under_limit`; PAN is supplied in UDF fields. Buyer billing address and invoice ID are mandatory. Source: `https://docs.payu.in/docs/cb-lrs-merchant-hosted-api-integration`, `https://docs.payu.in/reference/_payment_payu_hosted_checkout_cb_lrs`.
- PayU **Split Settlements** (aggregator → child merchants) requires child-merchant onboarding/KYC and nodal settlement. Foreign bank accounts are not a documented fit. Rejected for this feature.
- PayU **Payouts** are domestic-oriented. Not a route to foreign university accounts.

Conclusion: the bank account details the user has are necessary (PayU CB KYC + settlement) but not sufficient. Each university must onboard as a PayU cross-border merchant before money can be routed. This is a commercial/onboarding dependency, not a code change.

## 3. Goals / non-goals

Goals:
1. Let a student or an approved parent pay tuition to a specific university via PayU Cross-Border, with INR debited from the payer and foreign currency settled by PayU to the university.
2. Keep the platform fee flow unchanged; it remains a separate INR PayU charge.
3. Let university staff confirm receipt of tuition in the platform.
4. Keep the data model ready for a later bank-remittance channel (payer wires under own LRS, uploads UTR/proof, university confirms) without schema churn.

Non-goals (V1):
- No live FX rate API. Amounts are admin-entered with an FX snapshot.
- No refunds, no auto-reconciliation with university bank statements.
- No platform-held escrow, no redistribution of tuition money.
- No changes to the existing stage-fee amounts or `STAGE_PAYMENT_CONFIG`.
- No `UniversityAdmin.commission` settlement logic.
- No single combined checkout for fee + tuition.

## 4. Architecture / fund flow

```
Platform fee (unchanged)
  STUDENT -> POST /payments/initiate -> platform PayU merchant -> INR settles to platform

Tuition (new)
  ADMIN creates UniversityPaymentRequest (fixed INR amount + FX snapshot)
  STUDENT / APPROVED PARENT -> POST /university-payments/initiate
    -> backend picks that university's PayU CB credentials
    -> backend builds hash + LRS fields server-side
    -> payer posts form to PayU hosted checkout
  PayU -> INR debit from payer, FX conversion, settlement in university currency
       -> university's offshore bank account (T+2/T+3)
  PayU redirect -> POST /university-payments/verify (hash + server-side verify_payment)
  UNIVERSITY staff -> POST /university-payments/:id/confirm
```

- Platform never holds tuition money. PayU `SUCCESS` means "captured"; university confirmation is a separate event and the source of truth for "university received".
- Parent authorization: `ParentStudent` link with `status = APPROVED` and matching `studentId`. Never inferred from UI.
- University scope: derived from `user.universityAdmin.universityId` in the service layer, not from request params.

## 5. Data model (Prisma changes)

Add `UNIVERSITY` to `Role`.

Extend `UniversityAdmin` with `userId String? @unique` and `user User? @relation(...)`. One staff login per university in V1 (the model is already `@unique` on `universityId`).

New models:

```prisma
model UniversityPaymentRequest {
  id            String   @id @default(uuid())
  applicationId String
  universityId  String
  amountINR     Float
  currency      String   // university settlement currency, e.g. RUB / USD
  amountForeign Float?
  fxRate        Float?
  fxCapturedAt  DateTime?
  dueAt         DateTime?
  note          String?
  status        UniversityPaymentRequestStatus @default(OPEN)
  createdBy     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  application   UniversityApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  university    University            @relation(fields: [universityId], references: [id])
  payments      UniversityPayment[]

  @@index([applicationId])
  @@index([universityId, status])
}

enum UniversityPaymentRequestStatus {
  OPEN
  CLOSED
  CANCELLED
}

model UniversityPayment {
  id            String   @id @default(uuid())
  requestId     String
  applicationId String
  universityId  String
  studentId     String
  payerUserId   String
  payerRole     Role     // STUDENT or PARENT
  channel       UniversityPaymentChannel @default(PAYU_CROSS_BORDER)
  txnid         String   @unique
  payuMihpayid  String?
  amountINR     Float    // always INR: what payer is charged
  currency      String   // settlement currency from the request, e.g. RUB / USD
  amountForeign Float?
  fxRate        Float?
  status        UniversityPaymentStatus @default(PENDING)
  invoiceId     String
  lrsServiceType String  @default("education_non_loan")
  tcsAmount     Float?
  panLast4      String?  // full PAN is sent to PayU, never persisted
  billingSnapshot Json?  // name/address/city/state/country/zip captured at checkout
  bankRef       String?
  proofFileKey  String?  // only used by BANK_REMITTANCE channel
  paidAt        DateTime?
  confirmedAt   DateTime?
  confirmedBy   String?
  confirmationNote String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  request      UniversityPaymentRequest @relation(fields: [requestId], references: [id])
  application  UniversityApplication    @relation(fields: [applicationId], references: [id])
  university   University               @relation(fields: [universityId], references: [id])
  student      Student                  @relation(fields: [studentId], references: [id])
  payer        User                     @relation(fields: [payerUserId], references: [id])

  @@index([applicationId])
  @@index([universityId, status])
  @@index([payerUserId])
}

enum UniversityPaymentChannel {
  PAYU_CROSS_BORDER
  BANK_REMITTANCE
}

enum UniversityPaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

model UniversityPayuCredential {
  id          String   @id @default(uuid())
  universityId String  @unique
  merchantKey String
  saltEncrypted String // AES-encrypted at rest; never returned by any API
  baseUrl     String   @default("https://secure.payu.in/_payment")
  enabled     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  university University @relation(fields: [universityId], references: [id], onDelete: Cascade)
}
```

Rationale: a separate `UniversityPayment` model avoids touching `Payment`, whose stage-advance logic in `advanceAfterPayment()` would otherwise be affected. A dedicated credentials table keeps secrets out of the admin-editable `bankDetails` JSON.

## 6. API contract

Admin (`ADMIN`, `SUPER_ADMIN`):
- `POST /admin/university-payment-requests` — body: `applicationId`, `amountINR`, `currency`, optional `amountForeign`, `fxRate`, `dueAt`, `note`. Validate `amountINR <= 2500000`, application exists, university derived from application.
- `GET /admin/university-payment-requests?universityId=&status=`
- `POST /admin/university-payu-credentials` — upsert; `salt` is write-only. Reads return `merchantKey`, `baseUrl`, `enabled`, masked salt. Audit log every write.

Payer (`STUDENT`, `PARENT`):
- `GET /university-payments/requests?applicationId=` — returns OPEN requests. Student: own applications only. Parent: only applications of students with an APPROVED link.
- `POST /university-payments/initiate` — body: `requestId`, `pan`, `billingAddress` (line1, city, state, country, zip), optional `tcsDeclaration`. Backend derives application/university/student, verifies authorization, builds `txnid` + `invoiceId` + LRS hash, stores PENDING record with `panLast4` and billing snapshot, returns PayU form fields (hash, key, txnid, amount, productinfo, firstname, email, phone, surl, furl, lrs fields, udf1 = payment id, udf2 = university id).
- `POST /university-payments/verify` — public. Verify reverse hash; call PayU `verify_payment` server-side; update by `txnid` idempotently; cache/payment history invalidation not needed for this new table.
- `GET /university-payments?applicationId=` — history; scoped by role.

University (`UNIVERSITY`):
- `GET /university-payments?universityId` — universityId forced from `user.universityAdmin.universityId`; ignore any client-supplied value.
- `POST /university-payments/:id/confirm` — body: `note`. Allowed only when `status = SUCCESS` and payment belongs to that university. Sets `confirmedAt`, `confirmedBy`, `confirmationNote`. Audit logged.

## 7. Frontend changes

- `apps/web/app/(students)/student/payments/page.tsx` and parent payments page: add "Pay university" section listing OPEN requests per application; a small React Hook Form + Zod form for PAN and billing address; on success auto-submit the returned fields to PayU (same pattern as existing `PayNowForm`).
- Status display: PENDING / SUCCESS / FAILED / confirmed badge. PayU "captured" and "university confirmed" shown as two distinct states.
- New university staff dashboard page: table of payments for their university, confirm-receipt action with note.
- New admin screen: create payment request, upsert university PayU credentials (salt input, masked after save).
- Mobile responsive; reuse existing shared UI components and TanStack Query patterns.

## 8. Error handling / edge cases

- Hash mismatch, amount mismatch vs request, unknown txnid, or wrong university credential → reject with 400.
- Duplicate PayU callbacks → idempotent by unique `txnid`; no duplicate record or double status change.
- University CB not enabled (`enabled = false`) → block initiate with a clear message; never generate a checkout form.
- `amountINR > 2500000` → reject at request creation (PayU cap).
- PAN missing/invalid → reject at initiate; DOB comes from student profile (`Student.dob`); if missing, require it in the checkout form.
- Parent without APPROVED link → 403.
- University staff confirming a FAILED/PENDING payment or another university's payment → 403/409.
- `BANK_REMITTANCE` channel: initiate is a no-op redirect; payer uploads proof to `payment-proofs` folder via existing `StorageService`; confirmation still required. Add `payment-proofs` to the upload allowlist in `upload.controller.ts`.
- Refunds: no V1 endpoint; `REFUNDED` status reserved.

## 9. Security / compliance

- Salt encrypted at rest; never sent to browser or logs. New env var `UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY`, required in production via `config.validation.ts`.
- Full PAN never stored; only last 4 digits for audit.
- LRS/TCS disclosures shown to payer before redirect; declaration recorded.
- Role and ownership checks enforced in NestJS services/guards. No frontend-only gating.
- Audit log entries for: request creation, credential change, confirm receipt.
- No sensitive document or payment secret logging; follow existing `env.logBodiesRaw` opt-in rule.

## 10. Testing

- Unit: PayU hash/verify with LRS params; amount/cap validation; parent-link authorization; university scoping; idempotent verify.
- Integration/E2E: initiate → verify success → university confirms; parent pays for linked child; parent without link rejected; wrong-university confirm rejected; duplicate callback no-op; disabled CB credentials blocked.
- Location: `apps/api/src/payments/*.spec.ts` and `apps/api/test/` following existing patterns.

## 11. Open questions / dependencies (block implementation)

1. Confirm with PayU that a platform can initiate hosted-checkout requests on behalf of onboarded overseas universities (partner/tenant model), vs each university hosting its own checkout. If not permitted, switch to university-hosted links and keep this platform's role to request creation + status recording.
2. Confirm TCS handling and who remits it (PayU vs platform) for `education_non_loan`.
3. Confirm whether a single PayU merchant account can be used for multiple universities with settlement split abroad. Current design assumes one PayU CB account per university.
4. Legal review: LRS payer obligations and the platform's role as facilitator (no money holding).
5. FX source: admin-entered snapshot in V1; revisit live rates later.

## 12. Decision log

- A (PayU Cross-Border per university) chosen over B (Split Settlements — foreign accounts unsupported) and C (bank remittance — fallback, channel reserved in schema).
- Platform fee stays on the existing PayU flow; no combined checkout in V1.
- University staff confirmation separate from PayU success.
- No live FX API, no refunds, no new generic abstractions beyond the three new models.
