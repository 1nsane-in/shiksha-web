# University Direct Payments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let students and approved parents pay university tuition through PayU Cross-Border while the platform keeps its existing INR fee flow; let university staff confirm receipt.

**Architecture:** NestJS module `university-payments` owns requests, per-university PayU credentials, checkout initiation, callback verification, and scoped confirmation. PayU settles foreign currency directly to the university's offshore account; the platform never holds tuition money. Next.js adds payer checkout UI, a university confirmation dashboard, and admin request/credential screens.

**Tech Stack:** NestJS 10 + Prisma/PostgreSQL, class-validator, node `crypto` (AES-256-GCM), PayU Hosted Checkout `_payment` with LRS params, Next.js App Router, TanStack Query, React Hook Form + Zod, Tailwind/shadcn-style shared UI, Jest + Vitest.

## Global Constraints

- No git commits. User instruction: write files only; no commits while executing this plan.
- Source spec: `docs/superpowers/specs/2026-11-19-university-direct-payments-design.md`.
- PayU per-transaction cap: `amountINR <= 2500000`. Reject at request creation.
- LRS service type: `lrs_service_type = education_non_loan`. PAN is sent in `udf3` to PayU; only `panLast4` may be persisted.
- Reuse `generatePayUHash` / `verifyPayUResponse` from `apps/api/src/payments/dto/payment.dto.ts`. Do not write a second hash implementation.
- Existing `Payment` model and `STAGE_PAYMENT_CONFIG` (₹5,000 stage 2, ₹10,000 stage 3) are untouched.
- `UniversityAdmin.commission` is not used in this plan.
- Role enum gains `UNIVERSITY`; payer roles remain `STUDENT` or `PARENT` only.
- Parent may pay only when a `ParentStudent` row exists with `status = 'APPROVED'` for that student.
- University staff scope comes from `user.universityAdmin.universityId`; never trust a client-supplied universityId.
- Salt is encrypted at rest with `UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY` (32-byte hex). Salt never returned by any API or logged.
- Required env var added in both dev and production: `UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY`.
- Commands run from `apps/api` for backend, `apps/web` for frontend, unless path says otherwise.

---

### Task 1: Schema, migration, and boot-time env validation

**Files:**
- Create: `apps/api/prisma/schema/university-payment.prisma`
- Modify: `apps/api/prisma/schema/user.prisma` (User backrefs + Role enum)
- Modify: `apps/api/prisma/schema/university.prisma` (staff link + backrefs)
- Modify: `apps/api/prisma/schema/application.prisma` (backrefs)
- Modify: `apps/api/prisma/schema/student.prisma` (backref)
- Create: `apps/api/prisma/migrations/20261120000000_add_university_payments/migration.sql`
- Modify: `apps/api/src/common/config.validation.ts`
- Test: `apps/api/src/common/config.validation.spec.ts`

**Interfaces:**
- Produces: Prisma models `UniversityPaymentRequest`, `UniversityPayment`, `UniversityPayuCredential`; enums `UniversityPaymentRequestStatus`, `UniversityPaymentChannel`, `UniversityPaymentStatus`; `Role.UNIVERSITY`.
- Consumes: nothing.

- [ ] **Step 1: Add failing config test**

Append to `apps/api/src/common/config.validation.spec.ts` and add the key to `prodEnv`:

```ts
  PAYU_KEY: 'key',
  PAYU_SALT: 'salt',
  UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY: 'a'.repeat(64),
```

Add test:

```ts
  it('rejects missing university salt encryption key', () => {
    expect(() =>
      validateConfig({ ...prodEnv, UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY: '' }),
    ).toThrow(/UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY/);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run from `apps/api`: `pnpm test -- config.validation.spec.ts`
Expected: FAIL — `validateConfig` accepts config without the new key.

- [ ] **Step 3: Add Prisma models**

Create `apps/api/prisma/schema/university-payment.prisma`:

```prisma
model UniversityPaymentRequest {
  id            String                        @id @default(uuid())
  applicationId String
  universityId  String
  amountINR     Float
  currency      String
  amountForeign Float?
  fxRate        Float?
  fxCapturedAt  DateTime?
  tcsAmount     Float                         @default(0)
  dueAt         DateTime?
  note          String?
  status        UniversityPaymentRequestStatus @default(OPEN)
  createdBy     String
  createdAt     DateTime                      @default(now())
  updatedAt     DateTime                      @updatedAt

  application UniversityApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  university  University            @relation(fields: [universityId], references: [id])
  payments    UniversityPayment[]

  @@index([applicationId])
  @@index([universityId, status])
}

enum UniversityPaymentRequestStatus {
  OPEN
  CLOSED
  CANCELLED
}

model UniversityPayment {
  id               String                  @id @default(uuid())
  requestId        String
  applicationId    String
  universityId     String
  studentId        String
  payerUserId      String
  payerRole        Role
  channel          UniversityPaymentChannel @default(PAYU_CROSS_BORDER)
  txnid            String                  @unique
  payuMihpayid     String?
  amountINR        Float
  currency         String
  amountForeign    Float?
  fxRate           Float?
  status           UniversityPaymentStatus @default(PENDING)
  invoiceId        String
  lrsServiceType   String                  @default("education_non_loan")
  tcsAmount        Float                   @default(0)
  panLast4         String?
  billingSnapshot  Json?
  bankRef          String?
  proofFileKey     String?
  paidAt           DateTime?
  confirmedAt      DateTime?
  confirmedBy      String?
  confirmationNote String?
  createdAt        DateTime                @default(now())
  updatedAt        DateTime                @updatedAt

  request     UniversityPaymentRequest @relation(fields: [requestId], references: [id])
  application UniversityApplication    @relation(fields: [applicationId], references: [id])
  university  University               @relation(fields: [universityId], references: [id])
  student     Student                  @relation(fields: [studentId], references: [id])
  payer       User                     @relation(fields: [payerUserId], references: [id])

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
  id            String   @id @default(uuid())
  universityId  String   @unique
  merchantKey   String
  saltEncrypted String
  baseUrl       String   @default("https://secure.payu.in/_payment")
  enabled       Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  university University @relation(fields: [universityId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 4: Wire backrefs and new role**

In `apps/api/prisma/schema/user.prisma` add to `model User`:

```prisma
  universityAdmin   UniversityAdmin?
  universityPayments UniversityPayment[]
```

Change enum:

```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  STUDENT
  PARENT
  UNIVERSITY
}
```

In `apps/api/prisma/schema/university.prisma` add to `model UniversityAdmin`:

```prisma
  userId                String?  @unique
  user                  User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
```

Add to `model University`:

```prisma
  paymentRequests       UniversityPaymentRequest[]
  payments              UniversityPayment[]
  payuCredential        UniversityPayuCredential?
```

In `apps/api/prisma/schema/application.prisma` add to `model UniversityApplication`:

```prisma
  universityPaymentRequests UniversityPaymentRequest[]
  universityPayments        UniversityPayment[]
```

In `apps/api/prisma/schema/student.prisma` add to `model Student`:

```prisma
  universityPayments UniversityPayment[]
```

- [ ] **Step 5: Add migration SQL**

Create `apps/api/prisma/migrations/20261120000000_add_university_payments/migration.sql`:

```sql
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'UNIVERSITY';

ALTER TABLE "UniversityAdmin" ADD COLUMN IF NOT EXISTS "userId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "UniversityAdmin_userId_key" ON "UniversityAdmin"("userId");

CREATE TYPE "UniversityPaymentRequestStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');
CREATE TYPE "UniversityPaymentChannel" AS ENUM ('PAYU_CROSS_BORDER', 'BANK_REMITTANCE');
CREATE TYPE "UniversityPaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

CREATE TABLE "UniversityPaymentRequest" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "amountINR" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "amountForeign" DOUBLE PRECISION,
  "fxRate" DOUBLE PRECISION,
  "fxCapturedAt" TIMESTAMP(3),
  "tcsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dueAt" TIMESTAMP(3),
  "note" TEXT,
  "status" "UniversityPaymentRequestStatus" NOT NULL DEFAULT 'OPEN',
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UniversityPaymentRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UniversityPayment" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "payerUserId" TEXT NOT NULL,
  "payerRole" "Role" NOT NULL,
  "channel" "UniversityPaymentChannel" NOT NULL DEFAULT 'PAYU_CROSS_BORDER',
  "txnid" TEXT NOT NULL,
  "payuMihpayid" TEXT,
  "amountINR" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "amountForeign" DOUBLE PRECISION,
  "fxRate" DOUBLE PRECISION,
  "status" "UniversityPaymentStatus" NOT NULL DEFAULT 'PENDING',
  "invoiceId" TEXT NOT NULL,
  "lrsServiceType" TEXT NOT NULL DEFAULT 'education_non_loan',
  "tcsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "panLast4" TEXT,
  "billingSnapshot" JSONB,
  "bankRef" TEXT,
  "proofFileKey" TEXT,
  "paidAt" TIMESTAMP(3),
  "confirmedAt" TIMESTAMP(3),
  "confirmedBy" TEXT,
  "confirmationNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UniversityPayment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UniversityPayuCredential" (
  "id" TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "merchantKey" TEXT NOT NULL,
  "saltEncrypted" TEXT NOT NULL,
  "baseUrl" TEXT NOT NULL DEFAULT 'https://secure.payu.in/_payment',
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UniversityPayuCredential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UniversityPayment_txnid_key" ON "UniversityPayment"("txnid");
CREATE UNIQUE INDEX "UniversityPayuCredential_universityId_key" ON "UniversityPayuCredential"("universityId");
CREATE INDEX "UniversityPaymentRequest_applicationId_idx" ON "UniversityPaymentRequest"("applicationId");
CREATE INDEX "UniversityPaymentRequest_universityId_status_idx" ON "UniversityPaymentRequest"("universityId", "status");
CREATE INDEX "UniversityPayment_applicationId_idx" ON "UniversityPayment"("applicationId");
CREATE INDEX "UniversityPayment_universityId_status_idx" ON "UniversityPayment"("universityId", "status");
CREATE INDEX "UniversityPayment_payerUserId_idx" ON "UniversityPayment"("payerUserId");

ALTER TABLE "UniversityAdmin" ADD CONSTRAINT "UniversityAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UniversityPaymentRequest" ADD CONSTRAINT "UniversityPaymentRequest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UniversityPaymentRequest" ADD CONSTRAINT "UniversityPaymentRequest_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UniversityPayment" ADD CONSTRAINT "UniversityPayment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "UniversityPaymentRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UniversityPayment" ADD CONSTRAINT "UniversityPayment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "UniversityApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UniversityPayment" ADD CONSTRAINT "UniversityPayment_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UniversityPayment" ADD CONSTRAINT "UniversityPayment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UniversityPayment" ADD CONSTRAINT "UniversityPayment_payerUserId_fkey" FOREIGN KEY ("payerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UniversityPayuCredential" ADD CONSTRAINT "UniversityPayuCredential_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

- [ ] **Step 6: Enforce env var**

In `apps/api/src/common/config.validation.ts`, add `'UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY'` to both `required` arrays and add after the JWT length check:

```ts
  if (!isDev && value('UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY').length !== 64) {
    throw new Error(
      'UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).',
    );
  }
```

- [ ] **Step 7: Regenerate Prisma client and run tests**

Run: `cd apps/api && pnpm prisma generate && pnpm test -- config.validation.spec.ts`
Expected: PASS including the new test.

- [ ] **Step 8: Verification checkpoint (no commit)**

Run: `cd apps/api && pnpm build`
Expected: build succeeds. Do not run `git commit`.

---

### Task 2: Salt encryption helper

**Files:**
- Create: `apps/api/src/university-payments/crypto.util.ts`
- Test: `apps/api/src/university-payments/crypto.util.spec.ts`

**Interfaces:**
- Consumes: Node `crypto`.
- Produces: `encryptSecret(plain: string, keyHex: string): string` and `decryptSecret(payload: string, keyHex: string): string`. Payload format `base64(iv).base64(tag).base64(ciphertext)`.

- [ ] **Step 1: Write failing tests**

```ts
import { encryptSecret, decryptSecret } from './crypto.util';

const KEY = 'a'.repeat(64);

describe('university payment secret crypto', () => {
  it('round-trips a salt', () => {
    const encrypted = encryptSecret('super-secret-salt', KEY);
    expect(encrypted).not.toContain('super-secret-salt');
    expect(decryptSecret(encrypted, KEY)).toBe('super-secret-salt');
  });

  it('uses a random IV for each encryption', () => {
    expect(encryptSecret('same', KEY)).not.toBe(encryptSecret('same', KEY));
  });

  it('rejects a wrong key', () => {
    const encrypted = encryptSecret('secret', KEY);
    expect(() => decryptSecret(encrypted, 'b'.repeat(64))).toThrow();
  });

  it('rejects a non-32-byte key', () => {
    expect(() => encryptSecret('secret', 'abcd')).toThrow(
      /32-byte hex/,
    );
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd apps/api && pnpm test -- crypto.util.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement helper**

Create `apps/api/src/university-payments/crypto.util.ts`:

```ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function keyBuffer(keyHex: string): Buffer {
  if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error('UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY must be a 32-byte hex string');
  }
  return Buffer.from(keyHex, 'hex');
}

export function encryptSecret(plain: string, keyHex: string): string {
  const key = keyBuffer(keyHex);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join('.');
}

export function decryptSecret(payload: string, keyHex: string): string {
  const key = keyBuffer(keyHex);
  const [ivPart, tagPart, cipherPart] = payload.split('.');
  if (!ivPart || !tagPart || !cipherPart) {
    throw new Error('Invalid encrypted secret payload');
  }
  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivPart, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(tagPart, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(cipherPart, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd apps/api && pnpm test -- crypto.util.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Verification checkpoint (no commit)**

Run: `cd apps/api && pnpm build`
Expected: build succeeds.

---

### Task 3: DTOs and module wiring

**Files:**
- Create: `apps/api/src/university-payments/dto/university-payment.dto.ts`
- Test: `apps/api/src/university-payments/dto/university-payment.dto.spec.ts`

**Interfaces:**
- Consumes: Prisma models from Task 1.
- Produces: DTO classes `CreateUniversityPaymentRequestDto`, `UpsertUniversityPayuCredentialDto`, `CreateUniversityStaffDto`, `InitiateUniversityPaymentDto`, `ConfirmUniversityPaymentDto`, `BillingAddressDto`.

- [ ] **Step 1: Write DTO validation tests**

Create `apps/api/src/university-payments/dto/university-payment.dto.spec.ts`:

```ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  CreateUniversityPaymentRequestDto,
  InitiateUniversityPaymentDto,
} from './university-payment.dto';

describe('university payment DTOs', () => {
  it('rejects amounts above the PayU cross-border cap', async () => {
    const dto = plainToInstance(CreateUniversityPaymentRequestDto, {
      applicationId: '3f4a9c1e-9f9e-4d4a-9f2d-2f4f8b6a1a01',
      amountINR: 2500001,
      currency: 'USD',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'amountINR')).toBe(true);
  });

  it('rejects an invalid PAN', async () => {
    const dto = plainToInstance(InitiateUniversityPaymentDto, {
      requestId: '3f4a9c1e-9f9e-4d4a-9f2d-2f4f8b6a1a01',
      pan: 'NOT-A-PAN',
      billingAddress: {
        line1: '1 Main St',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        zip: '411001',
      },
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'pan')).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd apps/api && pnpm test -- university-payment.dto.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement DTOs**

Create `apps/api/src/university-payments/dto/university-payment.dto.ts`:

```ts
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUniversityPaymentRequestDto {
  @ApiProperty()
  @IsUUID()
  applicationId!: string;

  @ApiProperty({ maximum: 2500000 })
  @IsNumber()
  @Min(1)
  @Max(2500000)
  amountINR!: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amountForeign?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fxRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  tcsAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpsertUniversityPayuCredentialDto {
  @ApiProperty()
  @IsUUID()
  universityId!: string;

  @ApiProperty()
  @IsString()
  merchantKey!: string;

  @ApiProperty({ description: 'Raw PayU salt. Stored encrypted; never returned.' })
  @IsString()
  salt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  baseUrl?: string;

  @ApiProperty()
  @IsBoolean()
  enabled!: boolean;
}

export class CreateUniversityStaffDto {
  @ApiProperty()
  @IsUUID()
  universityId!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '9876543210' })
  @Matches(/^[0-9]{10}$/)
  phone!: string;
}

export class BillingAddressDto {
  @ApiProperty()
  @IsString()
  line1!: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  state!: string;

  @ApiProperty()
  @IsString()
  country!: string;

  @ApiProperty()
  @IsString()
  zip!: string;
}

export class InitiateUniversityPaymentDto {
  @ApiProperty()
  @IsUUID()
  requestId!: string;

  @ApiProperty({ example: 'ABCDE1234F' })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
  pan!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => BillingAddressDto)
  billingAddress!: BillingAddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  tcsDeclaration?: boolean;
}

export class ConfirmUniversityPaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
```

- [ ] **Step 4: Run tests**

Run: `cd apps/api && pnpm test -- university-payment.dto.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Verification checkpoint (no commit)**

Run: `cd apps/api && pnpm test -- university-payment.dto.spec.ts`
Expected: PASS. Do not run `git commit`.

---

### Task 4: Admin service — requests, credentials, staff linking

**Files:**
- Create: `apps/api/src/university-payments/university-payments-admin.service.ts`
- Test: `apps/api/src/university-payments/university-payments-admin.service.spec.ts`

**Interfaces:**
- Consumes: `CreateUniversityPaymentRequestDto`, `UpsertUniversityPayuCredentialDto`, `CreateUniversityStaffDto` from Task 3; `encryptSecret` from Task 2; `AuditLogService` from `apps/api/src/common/services/audit-log.service.ts`.
- Produces:
  - `createRequest(adminId: string, dto: CreateUniversityPaymentRequestDto): Promise<UniversityPaymentRequest>`
  - `upsertCredential(adminId: string, dto: UpsertUniversityPayuCredentialDto): Promise<{ universityId: string; merchantKey: string; baseUrl: string; enabled: boolean }>`
  - `createStaff(adminId: string, dto: CreateUniversityStaffDto): Promise<{ id: string; name: string; phone: string; universityId: string }>`

- [ ] **Step 1: Write failing tests**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UniversityPaymentsAdminService } from './university-payments-admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';

const mockPrisma = {
  universityApplication: { findUnique: jest.fn() },
  universityPaymentRequest: { create: jest.fn() },
  universityPayuCredential: { upsert: jest.fn() },
  universityAdmin: { findUnique: jest.fn(), update: jest.fn() },
  user: { findUnique: jest.fn(), create: jest.fn() },
};

const mockAudit = { log: jest.fn() };
const mockConfig = {
  get: jest.fn((key: string) =>
    key === 'UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY' ? 'a'.repeat(64) : undefined,
  ),
};

describe('UniversityPaymentsAdminService', () => {
  let service: UniversityPaymentsAdminService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityPaymentsAdminService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogService, useValue: mockAudit },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();
    service = module.get(UniversityPaymentsAdminService);
  });

  it('rejects a request above the cap before writing', async () => {
    mockPrisma.universityApplication.findUnique.mockResolvedValue({
      id: 'app-1',
      universityId: 'uni-1',
    });
    await expect(
      service.createRequest('admin-1', {
        applicationId: 'app-1',
        amountINR: 2500001,
        currency: 'USD',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mockPrisma.universityPaymentRequest.create).not.toHaveBeenCalled();
  });

  it('creates a request for the university on the application', async () => {
    mockPrisma.universityApplication.findUnique.mockResolvedValue({
      id: 'app-1',
      universityId: 'uni-1',
    });
    mockPrisma.universityPaymentRequest.create.mockResolvedValue({
      id: 'req-1',
    });
    const result = await service.createRequest('admin-1', {
      applicationId: 'app-1',
      amountINR: 1000,
      currency: 'USD',
    });
    expect(result).toEqual({ id: 'req-1' });
    expect(mockPrisma.universityPaymentRequest.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          universityId: 'uni-1',
          amountINR: 1000,
          createdBy: 'admin-1',
        }),
      }),
    );
    expect(mockAudit.log).toHaveBeenCalled();
  });

  it('rejects a request for a missing application', async () => {
    mockPrisma.universityApplication.findUnique.mockResolvedValue(null);
    await expect(
      service.createRequest('admin-1', {
        applicationId: 'missing',
        amountINR: 1000,
        currency: 'USD',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('stores an encrypted salt and never returns it', async () => {
    mockPrisma.universityPayuCredential.upsert.mockResolvedValue({});
    const result = await service.upsertCredential('admin-1', {
      universityId: 'uni-1',
      merchantKey: 'key-1',
      salt: 'raw-salt',
      enabled: true,
    });
    expect(result).not.toHaveProperty('salt');
    expect(result).not.toHaveProperty('saltEncrypted');
    const call = mockPrisma.universityPayuCredential.upsert.mock.calls[0][0];
    expect(call.create.saltEncrypted).not.toBe('raw-salt');
    expect(call.create.enabled).toBe(true);
  });

  it('rejects staff creation for an unknown university admin', async () => {
    mockPrisma.universityAdmin.findUnique.mockResolvedValue(null);
    await expect(
      service.createStaff('admin-1', {
        universityId: 'uni-1',
        name: 'Staff',
        phone: '9876543210',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd apps/api && pnpm test -- university-payments-admin.service.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement admin service**

```ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { encryptSecret } from './crypto.util';
import {
  CreateUniversityPaymentRequestDto,
  CreateUniversityStaffDto,
  UpsertUniversityPayuCredentialDto,
} from './dto/university-payment.dto';

@Injectable()
export class UniversityPaymentsAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
    private readonly config: ConfigService,
  ) {}

  async createRequest(adminId: string, dto: CreateUniversityPaymentRequestDto) {
    if (dto.amountINR > 2500000) {
      throw new BadRequestException(
        'amountINR cannot exceed the PayU cross-border cap of 2500000',
      );
    }
    const application = await this.prisma.universityApplication.findUnique({
      where: { id: dto.applicationId },
    });
    if (!application) throw new NotFoundException('Application not found');

    const request = await this.prisma.universityPaymentRequest.create({
      data: {
        applicationId: dto.applicationId,
        universityId: application.universityId,
        amountINR: dto.amountINR,
        currency: dto.currency,
        amountForeign: dto.amountForeign,
        fxRate: dto.fxRate,
        fxCapturedAt: dto.fxRate ? new Date() : null,
        tcsAmount: dto.tcsAmount ?? 0,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
        note: dto.note,
        createdBy: adminId,
      },
    });
    await this.audit.log({
      userId: adminId,
      action: 'UNIVERSITY_PAYMENT_REQUEST_CREATED',
      entityType: 'UniversityPaymentRequest',
      entityId: request.id,
      newValue: { amountINR: request.amountINR, universityId: request.universityId },
    });
    return request;
  }

  async upsertCredential(adminId: string, dto: UpsertUniversityPayuCredentialDto) {
    const key = this.config.get<string>('UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY');
    if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
      throw new BadRequestException('Salt encryption key is not configured');
    }
    const saltEncrypted = encryptSecret(dto.salt, key);
    await this.prisma.universityPayuCredential.upsert({
      where: { universityId: dto.universityId },
      create: {
        universityId: dto.universityId,
        merchantKey: dto.merchantKey,
        saltEncrypted,
        baseUrl: dto.baseUrl ?? 'https://secure.payu.in/_payment',
        enabled: dto.enabled,
      },
      update: {
        merchantKey: dto.merchantKey,
        saltEncrypted,
        baseUrl: dto.baseUrl ?? 'https://secure.payu.in/_payment',
        enabled: dto.enabled,
      },
    });
    await this.audit.log({
      userId: adminId,
      action: 'UNIVERSITY_PAYU_CREDENTIALS_UPDATED',
      entityType: 'UniversityPayuCredential',
      entityId: dto.universityId,
      newValue: { merchantKey: dto.merchantKey, enabled: dto.enabled },
    });
    return {
      universityId: dto.universityId,
      merchantKey: dto.merchantKey,
      baseUrl: dto.baseUrl ?? 'https://secure.payu.in/_payment',
      enabled: dto.enabled,
    };
  }

  async createStaff(adminId: string, dto: CreateUniversityStaffDto) {
    const universityAdmin = await this.prisma.universityAdmin.findUnique({
      where: { universityId: dto.universityId },
    });
    if (!universityAdmin) {
      throw new NotFoundException('University admin record not found');
    }
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existing) {
      throw new BadRequestException('Phone number already in use');
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        role: 'UNIVERSITY',
      },
    });
    await this.prisma.universityAdmin.update({
      where: { universityId: dto.universityId },
      data: { userId: user.id },
    });
    await this.audit.log({
      userId: adminId,
      action: 'UNIVERSITY_STAFF_CREATED',
      entityType: 'User',
      entityId: user.id,
      newValue: { universityId: dto.universityId, phone: dto.phone },
    });
    return {
      id: user.id,
      name: user.name,
      phone: user.phone ?? dto.phone,
      universityId: dto.universityId,
    };
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd apps/api && pnpm test -- university-payments-admin.service.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Verification checkpoint (no commit)**

Run: `cd apps/api && pnpm test -- university-payments-admin.service.spec.ts && pnpm build`
Expected: tests PASS; build succeeds. Do not run `git commit`.

---

### Task 5: Payer service — initiate, verify, scoped lists

**Files:**
- Create: `apps/api/src/university-payments/university-payments.service.ts`
- Test: `apps/api/src/university-payments/university-payments.service.spec.ts`

**Interfaces:**
- Consumes: `generatePayUHash`, `verifyPayUResponse` from `apps/api/src/payments/dto/payment.dto.ts`; `decryptSecret` from Task 2; DTOs from Task 3; Prisma models from Task 1.
- Produces:
  - `listRequests(userId: string, role: string, applicationId: string): Promise<unknown[]>`
  - `initiate(userId: string, role: string, dto: InitiateUniversityPaymentDto): Promise<PayUUniversityForm>`
  - `verify(dto: VerifyPayUPaymentDto): Promise<{ success: boolean; paymentId: string; universityId: string }>`
  - `listPayments(userId: string, role: string, applicationId?: string): Promise<unknown[]>`
  - exported interface `PayUUniversityForm` with fields: `payuBaseUrl`, `hash`, `key`, `txnid`, `amount`, `productinfo`, `firstname`, `email`, `phone`, `surl`, `furl`, `service_provider`, `udf1..udf5`, `lrs_service_type`, `lrs_mandatory_limit_declaration`, `lrs_tnc`, `tcs_amount`, `lrs_tcs_declaration_under_limit`.

- [ ] **Step 1: Write failing tests**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UniversityPaymentsService } from './university-payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { generatePayUHash } from '../payments/dto/payment.dto';

const mockPrisma = {
  universityPaymentRequest: { findUnique: jest.fn(), findMany: jest.fn() },
  universityPayment: { create: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), update: jest.fn(), findMany: jest.fn() },
  universityPayuCredential: { findUnique: jest.fn() },
  universityApplication: { findUnique: jest.fn() },
  student: { findUnique: jest.fn() },
  parent: { findUnique: jest.fn() },
  parentStudent: { findFirst: jest.fn() },
  user: { findUnique: jest.fn() },
};

const mockConfig = {
  get: jest.fn((key: string) => {
    const map: Record<string, string> = {
      FRONTEND_URL: 'https://app.example.com',
      PAYU_KEY: 'cb-key',
      PAYU_SALT: 'cb-salt',
      UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY: 'a'.repeat(64),
    };
    return map[key] ?? '';
  }),
};

describe('UniversityPaymentsService', () => {
  let service: UniversityPaymentsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityPaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();
    service = module.get(UniversityPaymentsService);
  });

  const request = {
    id: 'req-1',
    applicationId: 'app-1',
    universityId: 'uni-1',
    amountINR: 1000,
    currency: 'USD',
    amountForeign: 12,
    fxRate: 83.33,
    tcsAmount: 0,
    status: 'OPEN',
    application: {
      id: 'app-1',
      studentId: 'student-1',
      student: { userId: 'user-student', dob: new Date('2000-01-01') },
    },
  };

  it('lets the student pay for their own application', async () => {
    mockPrisma.universityPaymentRequest.findUnique.mockResolvedValue(request);
    mockPrisma.universityPayuCredential.findUnique.mockResolvedValue({
      merchantKey: 'uni-key',
      saltEncrypted: 'iv.tag.cipher',
      baseUrl: 'https://secure.payu.in/_payment',
      enabled: true,
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-student',
      name: 'Student',
      email: 's@example.com',
      phone: '9876543210',
    });
    mockPrisma.universityPayment.create.mockImplementation(({ data }) =>
      Promise.resolve({ ...data, id: 'pay-1' }),
    );

    const result = await service.initiate('user-student', 'STUDENT', {
      requestId: 'req-1',
      pan: 'ABCDE1234F',
      billingAddress: {
        line1: '1 Main St', city: 'Pune', state: 'MH', country: 'India', zip: '411001',
      },
    });

    expect(result.amount).toBe('1000.00');
    expect(result.lrs_service_type).toBe('education_non_loan');
    expect(result.udf3).toBe('ABCDE1234F');
    expect(result.hash).toBe(
      generatePayUHash({
        key: 'uni-key',
        txnid: result.txnid,
        amount: '1000.00',
        productinfo: result.productinfo,
        firstname: 'Student',
        email: 's@example.com',
        salt: 'decrypted-salt',
        udf1: 'pay-1',
        udf2: 'uni-1',
        udf3: 'ABCDE1234F',
        udf4: '2000-01-01',
        udf5: 'N',
      }),
    );
    expect(mockPrisma.universityPayment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ panLast4: '1234', payerRole: 'STUDENT' }),
      }),
    );
  });

  it('blocks a parent without an approved link', async () => {
    mockPrisma.universityPaymentRequest.findUnique.mockResolvedValue(request);
    mockPrisma.parent.findUnique.mockResolvedValue({ id: 'parent-1' });
    mockPrisma.parentStudent.findFirst.mockResolvedValue(null);
    await expect(
      service.initiate('user-parent', 'PARENT', {
        requestId: 'req-1',
        pan: 'ABCDE1234F',
        billingAddress: {
          line1: '1 Main St', city: 'Pune', state: 'MH', country: 'India', zip: '411001',
        },
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('blocks a disabled university checkout', async () => {
    mockPrisma.universityPaymentRequest.findUnique.mockResolvedValue(request);
    mockPrisma.universityPayuCredential.findUnique.mockResolvedValue({ enabled: false });
    await expect(
      service.initiate('user-student', 'STUDENT', {
        requestId: 'req-1',
        pan: 'ABCDE1234F',
        billingAddress: {
          line1: '1 Main St', city: 'Pune', state: 'MH', country: 'India', zip: '411001',
        },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd apps/api && pnpm test -- university-payments.service.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement service**

```ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  generatePayUHash,
  verifyPayUResponse,
  VerifyPayUPaymentDto,
} from '../payments/dto/payment.dto';
import { InitiateUniversityPaymentDto } from './dto/university-payment.dto';
import { decryptSecret } from './crypto.util';

export interface PayUUniversityForm {
  payuBaseUrl: string;
  hash: string;
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  service_provider: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  lrs_service_type: string;
  lrs_mandatory_limit_declaration: string;
  lrs_tnc: string;
  tcs_amount: string;
  lrs_tcs_declaration_under_limit: string;
}

@Injectable()
export class UniversityPaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private async assertCanPay(
    userId: string,
    role: string,
    application: { studentId: string; student: { userId: string } },
  ) {
    if (role === 'STUDENT') {
      if (application.student.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }
      return;
    }
    if (role === 'PARENT') {
      const parent = await this.prisma.parent.findUnique({ where: { userId } });
      if (!parent) throw new ForbiddenException('Parent profile not found');
      const link = await this.prisma.parentStudent.findFirst({
        where: {
          parentId: parent.id,
          studentId: application.studentId,
          status: 'APPROVED',
        },
      });
      if (!link) throw new ForbiddenException('No approved link to this student');
      return;
    }
    throw new ForbiddenException('Role cannot initiate tuition payments');
  }

  private async getRequestForApplication(requestId: string) {
    const request = await this.prisma.universityPaymentRequest.findUnique({
      where: { id: requestId },
      include: {
        application: { include: { student: true } },
      },
    });
    if (!request) throw new NotFoundException('Payment request not found');
    if (request.status !== 'OPEN') {
      throw new BadRequestException('Payment request is not open');
    }
    return request;
  }

  async listRequests(userId: string, role: string, applicationId: string) {
    const application = await this.prisma.universityApplication.findUnique({
      where: { id: applicationId },
      include: { student: true },
    });
    if (!application) throw new NotFoundException('Application not found');
    await this.assertCanPay(userId, role, application);
    return this.prisma.universityPaymentRequest.findMany({
      where: { applicationId, status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async initiate(userId: string, role: string, dto: InitiateUniversityPaymentDto): Promise<PayUUniversityForm> {
    const request = await this.getRequestForApplication(dto.requestId);
    await this.assertCanPay(userId, role, request.application);

    const credential = await this.prisma.universityPayuCredential.findUnique({
      where: { universityId: request.universityId },
    });
    if (!credential || !credential.enabled) {
      throw new BadRequestException('Cross-border checkout is not enabled for this university');
    }

    const payer = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!payer) throw new NotFoundException('Payer not found');

    const key = this.config.get<string>('UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY');
    if (!key) throw new BadRequestException('Salt encryption key is not configured');
    const salt = decryptSecret(credential.saltEncrypted, key);

    const txnid = 'UNI' + randomUUID().replace(/-/g, '').substring(0, 20);
    const productinfo = 'University_Tuition_' + request.universityId;
    const dob = request.application.student.dob
      ? request.application.student.dob.toISOString().substring(0, 10)
      : '';
    const udf5 = dto.tcsDeclaration ? 'Y' : 'N';

    const payment = await this.prisma.universityPayment.create({
      data: {
        requestId: request.id,
        applicationId: request.applicationId,
        universityId: request.universityId,
        studentId: request.application.studentId,
        payerUserId: userId,
        payerRole: role as 'STUDENT' | 'PARENT',
        channel: 'PAYU_CROSS_BORDER',
        txnid,
        amountINR: request.amountINR,
        currency: request.currency,
        amountForeign: request.amountForeign,
        fxRate: request.fxRate,
        status: 'PENDING',
        invoiceId: 'pending',
        tcsAmount: request.tcsAmount,
        panLast4: dto.pan.slice(-5, -1),
        billingSnapshot: dto.billingAddress as unknown as object,
      },
    });

    await this.prisma.universityPayment.update({
      where: { id: payment.id },
      data: { invoiceId: 'INV-' + payment.id },
    });

    const amount = request.amountINR.toFixed(2);
    const udf1 = payment.id;
    const udf2 = request.universityId;
    const udf3 = dto.pan;
    const udf4 = dob;

    const hash = generatePayUHash({
      key: credential.merchantKey,
      txnid,
      amount,
      productinfo,
      firstname: payer.name,
      email: payer.email ?? '',
      salt,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    });

    const frontend = this.config.get<string>('FRONTEND_URL') ?? '';
    return {
      payuBaseUrl: credential.baseUrl,
      hash,
      key: credential.merchantKey,
      txnid,
      amount,
      productinfo,
      firstname: payer.name,
      email: payer.email ?? '',
      phone: payer.phone ?? '',
      surl: frontend + '/payments/university/verify',
      furl: frontend + '/payments/university/verify',
      service_provider: 'payu_paisa',
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      lrs_service_type: 'education_non_loan',
      lrs_mandatory_limit_declaration: '1',
      lrs_tnc:
        this.config.get<string>('UNIVERSITY_LRS_TNC_URL') ??
        'https://payu.in/terms-conditions',
      tcs_amount: request.tcsAmount.toFixed(2),
      lrs_tcs_declaration_under_limit: '1',
    };
  }

  async verify(dto: VerifyPayUPaymentDto) {
    const payment = await this.prisma.universityPayment.findUnique({
      where: { txnid: dto.txnid },
    });
    if (!payment) throw new NotFoundException('University payment not found');

    const credential = await this.prisma.universityPayuCredential.findUnique({
      where: { universityId: payment.universityId },
    });
    if (!credential) throw new NotFoundException('University credentials not found');
    const key = this.config.get<string>('UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY');
    if (!key) throw new BadRequestException('Salt encryption key is not configured');
    const salt = decryptSecret(credential.saltEncrypted, key);

    const expectedHash = verifyPayUResponse({
      status: dto.status,
      txnid: dto.txnid,
      amount: dto.amount,
      productinfo: dto.productinfo,
      firstname: dto.firstname,
      email: dto.email,
      salt,
      key: credential.merchantKey,
      udf1: dto.udf1,
      udf2: dto.udf2,
      udf3: dto.udf3,
      udf4: dto.udf4,
      udf5: dto.udf5,
      additionalCharges: dto.additionalCharges,
    });
    if (expectedHash !== dto.hash.toLowerCase()) {
      throw new BadRequestException('Invalid payment response hash');
    }
    if (Number(dto.amount) !== payment.amountINR) {
      throw new BadRequestException('Payment amount does not match the request');
    }

    // Idempotent: a replayed callback must not re-write the record.
    if (payment.status === 'SUCCESS' || payment.status === 'FAILED') {
      return {
        success: payment.status === 'SUCCESS',
        paymentId: payment.id,
        universityId: payment.universityId,
      };
    }

    const success = dto.status === 'success';
    await this.prisma.universityPayment.update({
      where: { id: payment.id },
      data: {
        status: success ? 'SUCCESS' : 'FAILED',
        payuMihpayid: dto.mihpayid || dto.payumoney_id,
        bankRef: dto.bank_ref_num,
        paidAt: success ? new Date() : null,
      },
    });
    return {
      success,
      paymentId: payment.id,
      universityId: payment.universityId,
    };
  }

  async listPayments(userId: string, role: string, applicationId?: string) {
    const where: Prisma.UniversityPaymentWhereInput = {};
    if (applicationId) {
      const application = await this.prisma.universityApplication.findUnique({
        where: { id: applicationId },
        include: { student: true },
      });
      if (!application) throw new NotFoundException('Application not found');
      await this.assertCanPay(userId, role, application);
      where.applicationId = applicationId;
    } else if (role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({ where: { userId } });
      if (!student) throw new NotFoundException('Student profile not found');
      where.studentId = student.id;
    } else if (role === 'PARENT') {
      const parent = await this.prisma.parent.findUnique({ where: { userId } });
      if (!parent) throw new NotFoundException('Parent profile not found');
      const links = await this.prisma.parentStudent.findMany({
        where: { parentId: parent.id, status: 'APPROVED' },
        select: { studentId: true },
      });
      where.studentId = { in: links.map((l) => l.studentId) };
    } else {
      throw new ForbiddenException('Role cannot list university payments');
    }
    return this.prisma.universityPayment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

- [ ] **Step 4: Mock decrypted salt in the test**

In `university-payments.service.spec.ts`, mock the decrypt helper at the top:

```ts
jest.mock('./crypto.util', () => ({
  decryptSecret: jest.fn(() => 'decrypted-salt'),
}));
```

- [ ] **Step 5: Run tests to verify pass**

Run: `cd apps/api && pnpm test -- university-payments.service.spec.ts`
Expected: PASS (3 tests). `panLast4` holds the four digits of PAN (`'1234'` for `ABCDE1234F`); the check character is not persisted.

- [ ] **Step 6: Verification checkpoint (no commit)**

Run: `cd apps/api && pnpm test -- university-payments.service.spec.ts`
Expected: PASS. Do not run `git commit`.

---

### Task 6: University confirmation service

**Files:**
- Create: `apps/api/src/university-payments/university-confirmation.service.ts`
- Test: `apps/api/src/university-payments/university-confirmation.service.spec.ts`

**Interfaces:**
- Consumes: Prisma model `UniversityPayment`; `AuditLogService`.
- Produces:
  - `confirm(userId: string, paymentId: string, note?: string): Promise<UniversityPayment>`
  - `listForUniversity(userId: string): Promise<UniversityPayment[]>`

- [ ] **Step 1: Write failing tests**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UniversityConfirmationService } from './university-confirmation.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';

const mockPrisma = {
  user: { findUnique: jest.fn() },
  universityPayment: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn() },
};
const mockAudit = { log: jest.fn() };

describe('UniversityConfirmationService', () => {
  let service: UniversityConfirmationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityConfirmationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();
    service = module.get(UniversityConfirmationService);
  });

  it('rejects a user with no university admin link', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u', universityAdmin: null });
    await expect(service.listForUniversity('u')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('forces the university scope regardless of client input', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u',
      universityAdmin: { universityId: 'uni-1' },
    });
    mockPrisma.universityPayment.findMany.mockResolvedValue([]);
    await service.listForUniversity('u');
    expect(mockPrisma.universityPayment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { universityId: 'uni-1' } }),
    );
  });

  it('rejects confirmation of a payment that has not succeeded', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u',
      universityAdmin: { universityId: 'uni-1' },
    });
    mockPrisma.universityPayment.findFirst.mockResolvedValue({
      id: 'pay-1',
      universityId: 'uni-1',
      status: 'PENDING',
    });
    await expect(
      service.confirm('u', 'pay-1', 'ok'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd apps/api && pnpm test -- university-confirmation.service.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement service**

```ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';

@Injectable()
export class UniversityConfirmationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
  ) {}

  private async universityIdFor(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { universityAdmin: true },
    });
    if (!user?.universityAdmin) {
      throw new ForbiddenException('University staff profile not found');
    }
    return user.universityAdmin.universityId;
  }

  async listForUniversity(userId: string) {
    const universityId = await this.universityIdFor(userId);
    return this.prisma.universityPayment.findMany({
      where: { universityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async confirm(userId: string, paymentId: string, note?: string) {
    const universityId = await this.universityIdFor(userId);
    const payment = await this.prisma.universityPayment.findFirst({
      where: { id: paymentId, universityId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'SUCCESS') {
      throw new BadRequestException('Only successful payments can be confirmed');
    }
    const updated = await this.prisma.universityPayment.update({
      where: { id: paymentId },
      data: {
        confirmedAt: new Date(),
        confirmedBy: userId,
        confirmationNote: note,
      },
    });
    await this.audit.log({
      userId,
      action: 'UNIVERSITY_PAYMENT_CONFIRMED',
      entityType: 'UniversityPayment',
      entityId: paymentId,
      newValue: { universityId, confirmedAt: updated.confirmedAt },
    });
    return updated;
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd apps/api && pnpm test -- university-confirmation.service.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Verification checkpoint (no commit)**

Run: `cd apps/api && pnpm test -- university-confirmation.service.spec.ts`
Expected: PASS. Do not run `git commit`.

---

### Task 7: Controllers and HTTP wiring

**Files:**
- Create: `apps/api/src/university-payments/university-payments.controller.ts`
- Create: `apps/api/src/university-payments/university-payments-admin.controller.ts`
- Create: `apps/api/src/university-payments/university-payments.module.ts`
- Modify: `apps/api/src/app.module.ts`

**Interfaces:**
- Consumes: services from Tasks 4–6; `JwtAuthGuard`, `RolesGuard`, `Public`, `Roles`, `AuthUser` from existing auth module.
- Produces: REST routes:
  - `GET /university-payments/requests?applicationId=`
  - `POST /university-payments/initiate`
  - `POST /university-payments/verify` (public)
  - `GET /university-payments/history?applicationId=`
  - `POST /university-payments/:id/confirm` (UNIVERSITY)
  - `POST /admin/university-payment-requests`
  - `POST /admin/university-payu-credentials`
  - `POST /admin/university-staff`

- [ ] **Step 1: Add controller test**

Create `apps/api/src/university-payments/university-payments.controller.spec.ts`:

```ts
import { UniversityPaymentsController } from './university-payments.controller';

describe('UniversityPaymentsController', () => {
  it('exposes the expected route handlers', () => {
    const proto = UniversityPaymentsController.prototype;
    expect(typeof proto.listRequests).toBe('function');
    expect(typeof proto.initiate).toBe('function');
    expect(typeof proto.verify).toBe('function');
    expect(typeof proto.history).toBe('function');
    expect(typeof proto.confirm).toBe('function');
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd apps/api && pnpm test -- university-payments.controller.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement payer/university controller**

```ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';
import { UniversityPaymentsService } from './university-payments.service';
import { UniversityConfirmationService } from './university-confirmation.service';
import {
  InitiateUniversityPaymentDto,
  ConfirmUniversityPaymentDto,
} from './dto/university-payment.dto';
import { VerifyPayUPaymentDto } from '../payments/dto/payment.dto';

@ApiTags('University Payments')
@ApiBearerAuth()
@Controller('university-payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversityPaymentsController {
  constructor(
    private readonly payments: UniversityPaymentsService,
    private readonly confirmation: UniversityConfirmationService,
  ) {}

  @Get('requests')
  @Roles('STUDENT', 'PARENT')
  @ApiOperation({ summary: 'List open university payment requests for an application' })
  listRequests(
    @AuthUser() user: AuthenticatedUser,
    @Query('applicationId') applicationId: string,
  ) {
    return this.payments.listRequests(user.id, user.role, applicationId);
  }

  @Post('initiate')
  @Roles('STUDENT', 'PARENT')
  @ApiOperation({ summary: 'Initiate PayU cross-border university payment' })
  initiate(
    @AuthUser() user: AuthenticatedUser,
    @Body() dto: InitiateUniversityPaymentDto,
  ) {
    return this.payments.initiate(user.id, user.role, dto);
  }

  @Public()
  @Post('verify')
  @ApiOperation({ summary: 'Verify PayU university payment callback' })
  verify(@Body() dto: VerifyPayUPaymentDto) {
    return this.payments.verify(dto);
  }

  @Get('history')
  @Roles('STUDENT', 'PARENT')
  @ApiOperation({ summary: 'University payment history for the payer' })
  history(
    @AuthUser() user: AuthenticatedUser,
    @Query('applicationId') applicationId?: string,
  ) {
    return this.payments.listPayments(user.id, user.role, applicationId);
  }

  @Get('university')
  @Roles('UNIVERSITY')
  @ApiOperation({ summary: 'Payments for the signed-in university staff member' })
  forUniversity(@AuthUser() user: AuthenticatedUser) {
    return this.confirmation.listForUniversity(user.id);
  }

  @Post(':id/confirm')
  @Roles('UNIVERSITY')
  @ApiOperation({ summary: 'Confirm receipt of a university payment' })
  confirm(
    @AuthUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ConfirmUniversityPaymentDto,
  ) {
    return this.confirmation.confirm(user.id, id, dto.note);
  }
}
```

- [ ] **Step 4: Implement admin controller**

```ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUser } from '../auth/decorators/user.decorator';
import type { AuthenticatedUser } from '../common/types/request.type';
import { UniversityPaymentsAdminService } from './university-payments-admin.service';
import {
  CreateUniversityPaymentRequestDto,
  CreateUniversityStaffDto,
  UpsertUniversityPayuCredentialDto,
} from './dto/university-payment.dto';

@ApiTags('University Payments Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversityPaymentsAdminController {
  constructor(private readonly admin: UniversityPaymentsAdminService) {}

  @Post('university-payment-requests')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a university tuition payment request' })
  createRequest(
    @AuthUser() user: AuthenticatedUser,
    @Body() dto: CreateUniversityPaymentRequestDto,
  ) {
    return this.admin.createRequest(user.id, dto);
  }

  @Post('university-payu-credentials')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Upsert a university PayU cross-border credential' })
  upsertCredential(
    @AuthUser() user: AuthenticatedUser,
    @Body() dto: UpsertUniversityPayuCredentialDto,
  ) {
    return this.admin.upsertCredential(user.id, dto);
  }

  @Post('university-staff')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a UNIVERSITY staff login linked to a university' })
  createStaff(
    @AuthUser() user: AuthenticatedUser,
    @Body() dto: CreateUniversityStaffDto,
  ) {
    return this.admin.createStaff(user.id, dto);
  }
}
```

- [ ] **Step 5: Create module and register it**

Create `apps/api/src/university-payments/university-payments.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { UniversityPaymentsService } from './university-payments.service';
import { UniversityPaymentsAdminService } from './university-payments-admin.service';
import { UniversityConfirmationService } from './university-confirmation.service';
import { UniversityPaymentsController } from './university-payments.controller';
import { UniversityPaymentsAdminController } from './university-payments-admin.controller';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [UniversityPaymentsController, UniversityPaymentsAdminController],
  providers: [
    UniversityPaymentsService,
    UniversityPaymentsAdminService,
    UniversityConfirmationService,
  ],
  exports: [
    UniversityPaymentsService,
    UniversityPaymentsAdminService,
    UniversityConfirmationService,
  ],
})
export class UniversityPaymentsModule {}
```

In `apps/api/src/app.module.ts` add the import and register the module after `PaymentsModule`:

```ts
import { UniversityPaymentsModule } from './university-payments/university-payments.module';
```

```ts
    PaymentsModule,
    UniversityPaymentsModule,
```

- [ ] **Step 6: Run all backend tests and build**

Run: `cd apps/api && pnpm test && pnpm build`
Expected: all Jest suites PASS, build succeeds. If build reports Prisma types missing, run `pnpm prisma generate` first.

- [ ] **Step 7: Verification checkpoint (no commit)**

Run: `cd apps/api && pnpm test && pnpm build`
Expected: PASS. Do not run `git commit`.

---

### Task 8: Frontend domain layer and role routing

**Files:**
- Create: `apps/web/domains/university-payments/university-payments.types.ts`
- Create: `apps/web/domains/university-payments/university-payments.api.ts`
- Create: `apps/web/domains/university-payments/university-payments.queries.ts`
- Create: `apps/web/domains/university-payments/checkout.schema.ts`
- Create: `apps/web/domains/university-payments/index.ts`
- Modify: `apps/web/shared/api/queryKeys.ts`
- Modify: `apps/web/stores/auth-store.ts`
- Modify: `apps/web/hooks/useAuth.ts`
- Modify: `apps/web/components/auth/ProtectedRoute.tsx`
- Modify: `apps/web/domains/auth/auth.types.ts`
- Modify: `apps/web/domains/auth/auth.queries.ts`
- Modify: `apps/web/middleware.ts`
- Test: `apps/web/domains/university-payments/checkout.schema.test.ts`

**Interfaces:**
- Consumes: `client` from `apps/web/shared/api/client.ts`; `queryKeys`; `useQuery`/`useMutation`.
- Produces: API fns `getUniversityRequests`, `initiateUniversityPayment`, `verifyUniversityPayment`, `getUniversityPaymentHistory`, `listUniversityPaymentsForStaff`, `confirmUniversityPayment`; hooks `useUniversityRequests`, `useInitiateUniversityPayment`, `useVerifyUniversityPayment`, `useUniversityPaymentHistory`, `useUniversityStaffPayments`, `useConfirmUniversityPayment`; `universityCheckoutSchema`.

- [ ] **Step 1: Write failing Zod test**

```ts
import { universityCheckoutSchema } from './checkout.schema';

describe('universityCheckoutSchema', () => {
  const valid = {
    pan: 'ABCDE1234F',
    billingAddress: {
      line1: '1 Main St',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      zip: '411001',
    },
    tcsDeclaration: true,
  };

  it('accepts a valid checkout payload', () => {
    expect(universityCheckoutSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects malformed PAN', () => {
    expect(
      universityCheckoutSchema.safeParse({ ...valid, pan: 'bad' }).success,
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd apps/web && pnpm test -- checkout.schema.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement domain files**

`checkout.schema.ts`:

```ts
import { z } from 'zod';

export const billingAddressSchema = z.object({
  line1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'PIN code is required'),
});

export const universityCheckoutSchema = z.object({
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN, e.g. ABCDE1234F')
    .transform((value) => value.toUpperCase()),
  billingAddress: billingAddressSchema,
  tcsDeclaration: z.boolean().default(false),
});

export type UniversityCheckoutInput = z.infer<typeof universityCheckoutSchema>;
```

`university-payments.types.ts`:

```ts
export interface UniversityPaymentRequest {
  id: string;
  applicationId: string;
  universityId: string;
  amountINR: number;
  currency: string;
  amountForeign?: number;
  fxRate?: number;
  tcsAmount: number;
  dueAt?: string;
  note?: string;
  status: "OPEN" | "CLOSED" | "CANCELLED";
}

export interface UniversityPayUForm {
  payuBaseUrl: string;
  hash: string;
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  service_provider: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  lrs_service_type: string;
  lrs_mandatory_limit_declaration: string;
  lrs_tnc: string;
  tcs_amount: string;
  lrs_tcs_declaration_under_limit: string;
}

export interface UniversityPaymentItem {
  id: string;
  requestId: string;
  applicationId: string;
  universityId: string;
  studentId: string;
  payerUserId: string;
  payerRole: "STUDENT" | "PARENT";
  txnid: string;
  amountINR: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  invoiceId: string;
  panLast4?: string;
  paidAt?: string;
  confirmedAt?: string;
  confirmationNote?: string;
  createdAt: string;
}

export interface InitiateUniversityPaymentDto {
  requestId: string;
  pan: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  tcsDeclaration?: boolean;
}

export interface VerifyUniversityPaymentDto {
  status: string;
  txnid: string;
  mihpayid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  error?: string;
  error_Message?: string;
  bank_ref_num?: string;
  mode?: string;
  additionalCharges?: string;
}
```

`university-payments.api.ts`:

```ts
import { client } from "@/shared/api/client";
import type {
  UniversityPaymentRequest,
  UniversityPayUForm,
  UniversityPaymentItem,
  InitiateUniversityPaymentDto,
  VerifyUniversityPaymentDto,
} from "./university-payments.types";

export function getUniversityRequests(applicationId: string) {
  return client.get<UniversityPaymentRequest[]>("/university-payments/requests", {
    params: { applicationId },
  });
}

export function initiateUniversityPayment(dto: InitiateUniversityPaymentDto) {
  return client.post<UniversityPayUForm>("/university-payments/initiate", dto);
}

export function verifyUniversityPayment(dto: VerifyUniversityPaymentDto) {
  return client.post<{
    success: boolean;
    paymentId: string;
    universityId: string;
  }>("/university-payments/verify", dto);
}

export function getUniversityPaymentHistory(applicationId?: string) {
  return client.get<UniversityPaymentItem[]>("/university-payments/history", {
    params: applicationId ? { applicationId } : {},
  });
}

export function listUniversityPaymentsForStaff() {
  return client.get<UniversityPaymentItem[]>("/university-payments/university");
}

export function confirmUniversityPayment(id: string, note?: string) {
  return client.post<UniversityPaymentItem>(`/university-payments/${id}/confirm`, {
    note,
  });
}
```

`university-payments.queries.ts`:

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type {
  InitiateUniversityPaymentDto,
  VerifyUniversityPaymentDto,
} from "./university-payments.types";

export function useUniversityRequests(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.universityPayments.requests(applicationId),
    queryFn: async () => {
      const { getUniversityRequests } = await import("./university-payments.api");
      return getUniversityRequests(applicationId);
    },
    enabled: Boolean(applicationId),
  });
}

export function useInitiateUniversityPayment() {
  return useMutation({
    mutationFn: async (dto: InitiateUniversityPaymentDto) => {
      const { initiateUniversityPayment } = await import("./university-payments.api");
      return initiateUniversityPayment(dto);
    },
  });
}

export function useVerifyUniversityPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: VerifyUniversityPaymentDto) => {
      const { verifyUniversityPayment } = await import("./university-payments.api");
      return verifyUniversityPayment(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universityPayments.all });
    },
  });
}

export function useUniversityPaymentHistory(applicationId?: string) {
  return useQuery({
    queryKey: queryKeys.universityPayments.history(applicationId),
    queryFn: async () => {
      const { getUniversityPaymentHistory } = await import("./university-payments.api");
      return getUniversityPaymentHistory(applicationId);
    },
  });
}

export function useUniversityStaffPayments() {
  return useQuery({
    queryKey: queryKeys.universityPayments.staff(),
    queryFn: async () => {
      const { listUniversityPaymentsForStaff } = await import("./university-payments.api");
      return listUniversityPaymentsForStaff();
    },
  });
}

export function useConfirmUniversityPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note?: string }) => {
      const { confirmUniversityPayment } = await import("./university-payments.api");
      return confirmUniversityPayment(id, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universityPayments.all });
    },
  });
}
```

`index.ts`:

```ts
export * from "./university-payments.types";
export * from "./university-payments.queries";
export * from "./checkout.schema";
```

Add to `apps/web/shared/api/queryKeys.ts` inside `queryKeys`:

```ts
  universityPayments: {
    all: ["university-payments"] as const,
    requests: (applicationId: string) =>
      [...queryKeys.universityPayments.all, "requests", applicationId] as const,
    history: (applicationId?: string) =>
      [...queryKeys.universityPayments.all, "history", applicationId] as const,
    staff: () => [...queryKeys.universityPayments.all, "staff"] as const,
  },
```

- [ ] **Step 4: Add UNIVERSITY role to auth layer**

In `apps/web/stores/auth-store.ts`:

```ts
  role: "STUDENT" | "PARENT" | "ADMIN" | "SUPER_ADMIN" | "UNIVERSITY";
```

Append:

```ts
export const selectIsUniversity = (s: AuthState) => s.user?.role === "UNIVERSITY";
```

In `apps/web/hooks/useAuth.ts`, replace the first import line with:

```ts
import { useAuthStore, selectUser, selectToken, selectIsAuthenticated, selectIsAdmin, selectIsSuperAdmin, selectIsStudent, selectIsUniversity } from "@/stores/auth-store";
```

Then add:

```ts
  const isUniversity = useAuthStore(selectIsUniversity);
```

Add `isUniversity` to the returned object:

```ts
    isUniversity,
```

In `apps/web/components/auth/ProtectedRoute.tsx`:

```tsx
  requireUniversity?: boolean;
```

```tsx
  requireUniversity = false,
```

```tsx
  const { user, loading, isAuthenticated, isAdmin, isSuperAdmin, isUniversity } = useAuth();
```

Add after the admin check in `useEffect`:

```tsx
      if (requireUniversity && !isUniversity) {
        router.push("/");
        return;
      }
```

Replace the dependency array and add the render-time guard:

```tsx
  }, [loading, isAuthenticated, user, router, requireAdmin, requireSuperAdmin, requireUniversity, isUniversity]);
```

```tsx
  if (requireUniversity && !isUniversity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You need University staff privileges to access this page.
          </p>
        </div>
      </div>
    );
  }
```

In `apps/web/domains/auth/auth.types.ts`, change the role union:

```ts
export type UserRole = "STUDENT" | "PARENT" | "ADMIN" | "SUPER_ADMIN" | "UNIVERSITY";
```

In `apps/web/domains/auth/auth.queries.ts`, inside `getDashboardForRole`:

```ts
  if (role === "UNIVERSITY") {
    router.push("/university/payments");
  } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
```

In `apps/web/middleware.ts`, add to `roleDefaults`:

```ts
  university: "/university/payments",
```

- [ ] **Step 5: Run test and typecheck**

Run: `cd apps/web && pnpm test -- checkout.schema.test.ts && pnpm build`
Expected: test PASS; build succeeds.

- [ ] **Step 6: Verification checkpoint (no commit)**

Run: `cd apps/web && pnpm test -- checkout.schema.test.ts && pnpm build`
Expected: PASS. Do not run `git commit`.

---

### Task 9: Payer checkout UI and verification page

**Files:**
- Create: `apps/web/components/student/university-payment-form.tsx`
- Modify: `apps/web/app/(students)/student/payments/page.tsx`
- Modify: `apps/web/app/(parents)/parents/dashboard/page.tsx`
- Create: `apps/web/app/(shared)/payments/university/verify/page.tsx`

**Interfaces:**
- Consumes: hooks/types from Task 8; `useAuth`, `useMyApplications` from `@/domains/student`.
- Produces: `UniversityPaymentForm` component with props `{ applicationId: string }`; verification route `/payments/university/verify`.

- [ ] **Step 1: Write failing field-mapping test**

Create `apps/web/components/student/university-payment-form.test.ts`:

```ts
import { buildPayUFields } from "./university-payment-form";

describe("buildPayUFields", () => {
  it("maps every PayU and LRS field into the redirect form", () => {
    const fields = buildPayUFields({
      payuBaseUrl: "https://test.payu.in/_payment",
      hash: "abc",
      key: "key",
      txnid: "UNI123",
      amount: "1000.00",
      productinfo: "University_Tuition_uni-1",
      firstname: "Student",
      email: "s@example.com",
      phone: "9876543210",
      surl: "https://app.example.com/payments/university/verify",
      furl: "https://app.example.com/payments/university/verify",
      service_provider: "payu_paisa",
      udf1: "pay-1",
      udf2: "uni-1",
      udf3: "ABCDE1234F",
      udf4: "2000-01-01",
      udf5: "N",
      lrs_service_type: "education_non_loan",
      lrs_mandatory_limit_declaration: "1",
      lrs_tnc: "https://payu.in/terms-conditions",
      tcs_amount: "0.00",
      lrs_tcs_declaration_under_limit: "1",
    });
    expect(fields.lrs_service_type).toBe("education_non_loan");
    expect(fields.udf3).toBe("ABCDE1234F");
    expect(fields.tcs_amount).toBe("0.00");
    expect(Object.keys(fields)).toHaveLength(21);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd apps/web && pnpm test -- university-payment-form.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement checkout form**

```tsx
"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { toast } from "sonner";
import {
  useUniversityRequests,
  useInitiateUniversityPayment,
  universityCheckoutSchema,
  type UniversityCheckoutInput,
  type UniversityPayUForm,
} from "@/domains/university-payments";

export function buildPayUFields(data: UniversityPayUForm): Record<string, string> {
  return {
    hash: data.hash,
    key: data.key,
    txnid: data.txnid,
    amount: data.amount,
    productinfo: data.productinfo,
    firstname: data.firstname,
    email: data.email,
    phone: data.phone,
    surl: data.surl,
    furl: data.furl,
    service_provider: data.service_provider,
    udf1: data.udf1,
    udf2: data.udf2,
    udf3: data.udf3,
    udf4: data.udf4,
    udf5: data.udf5,
    lrs_service_type: data.lrs_service_type,
    lrs_mandatory_limit_declaration: data.lrs_mandatory_limit_declaration,
    lrs_tnc: data.lrs_tnc,
    tcs_amount: data.tcs_amount,
    lrs_tcs_declaration_under_limit: data.lrs_tcs_declaration_under_limit,
  };
}

function postToPayU(form: HTMLFormElement, data: UniversityPayUForm) {
  form.action = data.payuBaseUrl;
  form.method = "POST";
  Object.entries(buildPayUFields(data)).forEach(([name, value]) => {
    let input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    }
    input.value = value;
  });
  form.submit();
}

export function UniversityPaymentForm({ applicationId }: { applicationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: requests, isLoading } = useUniversityRequests(applicationId);
  const initiate = useInitiateUniversityPayment();
  const { register, handleSubmit, formState: { errors } } = useForm<UniversityCheckoutInput>({
    resolver: zodResolver(universityCheckoutSchema),
  });

  if (isLoading) return <Card className="p-5">Loading university payments…</Card>;
  if (!requests?.length) {
    return <Card className="p-5">No university payments due.</Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay university directly</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-lg border p-4">
            <p className="text-sm font-medium">
              ₹{request.amountINR.toLocaleString("en-IN")} for {request.currency} tuition
            </p>
            <form
              ref={formRef}
              className="mt-3 space-y-2"
              onSubmit={handleSubmit(async (values) => {
                try {
                  const data = await initiate.mutateAsync({
                    requestId: request.id,
                    pan: values.pan,
                    billingAddress: values.billingAddress,
                    tcsDeclaration: values.tcsDeclaration,
                  });
                  if (formRef.current) postToPayU(formRef.current, data);
                } catch {
                  toast.error("Could not start university payment. Please try again.");
                }
              })}
            >
              <input {...register("pan")} placeholder="PAN (e.g. ABCDE1234F)" className="w-full rounded border p-2 text-sm" />
              {errors.pan && <p className="text-xs text-red-600">{errors.pan.message}</p>}
              <input {...register("billingAddress.line1")} placeholder="Address line 1" className="w-full rounded border p-2 text-sm" />
              <input {...register("billingAddress.city")} placeholder="City" className="w-full rounded border p-2 text-sm" />
              <input {...register("billingAddress.state")} placeholder="State" className="w-full rounded border p-2 text-sm" />
              <input {...register("billingAddress.country")} placeholder="Country" className="w-full rounded border p-2 text-sm" />
              <input {...register("billingAddress.zip")} placeholder="PIN code" className="w-full rounded border p-2 text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("tcsDeclaration")} />
                I accept the LRS/TCS declaration for education remittance.
              </label>
              <Button type="submit" disabled={initiate.isPending}>
                {initiate.isPending ? "Redirecting…" : "Pay university"}
              </Button>
            </form>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Mount on student and parent pages**

In `apps/web/app/(students)/student/payments/page.tsx`, add imports:

```tsx
import { UniversityPaymentForm } from "@/components/student/university-payment-form";
```

In `PaymentsPage()` (line 181), `applicationId` is already computed at line 191. Render the form immediately after the page heading block:

```tsx
      {applicationId ? (
        <UniversityPaymentForm applicationId={applicationId} />
      ) : null}
```

In `apps/api/src/parents/parents.service.ts`, inside `getChildren()`, extend the `include` block:

```ts
            payments: { select: { id: true, status: true, amount: true } },
            applications: { select: { id: true }, take: 1 },
```

and extend the returned object:

```ts
      applicationId: link.student.applications[0]?.id ?? null,
```

In `apps/web/domains/parents/parents.types.ts`, add to the linked-child interface:

```ts
  applicationId?: string | null;
```

In `apps/web/app/(parents)/parents/dashboard/page.tsx`, add the same `UniversityPaymentForm` import and render inside `ChildrenList` after the children cards:

```tsx
{children?.map((child) =>
  child.applicationId ? (
    <UniversityPaymentForm key={child.id} applicationId={child.applicationId} />
  ) : null,
)}
```

- [ ] **Step 5: Implement verification route**

Create `apps/web/app/(shared)/payments/university/verify/page.tsx`:

```tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyUniversityPayment } from "@/domains/university-payments/university-payments.api";

type State = "loading" | "success" | "failed" | "error";

function VerifyUniversityPaymentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      const txnid = params.get("txnid") || "";
      const hash = params.get("hash") || "";
      if (!txnid || !hash) {
        setState("error");
        setMessage("Missing payment parameters. Contact support.");
        return;
      }
      try {
        const result = await verifyUniversityPayment({
          status: params.get("status") || "success",
          txnid,
          mihpayid: params.get("mihpayid") || "",
          amount: params.get("amount") || "",
          productinfo: params.get("productinfo") || "",
          firstname: params.get("firstname") || "",
          email: params.get("email") || "",
          hash,
          udf1: params.get("udf1") || undefined,
          udf2: params.get("udf2") || undefined,
          udf3: params.get("udf3") || undefined,
          udf4: params.get("udf4") || undefined,
          udf5: params.get("udf5") || undefined,
          error: params.get("error") || undefined,
          error_Message: params.get("error_Message") || undefined,
          bank_ref_num: params.get("bank_ref_num") || undefined,
          mode: params.get("mode") || undefined,
          additionalCharges: params.get("additionalCharges") || undefined,
        });
        setState(result.success ? "success" : "failed");
        setMessage(
          result.success
            ? "University payment captured. We are waiting for the university to confirm receipt."
            : "Payment failed. Please try again.",
        );
      } catch {
        setState("error");
        setMessage("Could not verify payment. Contact support with your transaction ID.");
      }
    }
    verify();
  }, [params]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border p-8 text-center">
        {state === "loading" && <Loader2 className="mx-auto size-10 animate-spin" />}
        {state === "success" && <CheckCircle2 className="mx-auto size-12 text-green-600" />}
        {state === "failed" && <XCircle className="mx-auto size-12 text-red-600" />}
        {state === "error" && <XCircle className="mx-auto size-12 text-amber-600" />}
        <h1 className="mt-4 text-lg font-semibold">{state === "success" ? "Payment captured" : "University payment"}</h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <Button className="mt-6" onClick={() => router.push("/student/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}

export default function VerifyUniversityPaymentPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Verifying…</div>}>
      <VerifyUniversityPaymentContent />
    </Suspense>
  );
}
```

- [ ] **Step 6: Run tests and build**

Run: `cd apps/web && pnpm test && pnpm build`
Expected: tests PASS, build succeeds.

- [ ] **Step 7: Verification checkpoint (no commit)**

Run: `cd apps/web && pnpm test && pnpm build`
Expected: PASS. Do not run `git commit`.

---

### Task 10: University staff dashboard and admin screens

**Files:**
- Create: `apps/web/app/(university)/university/payments/page.tsx`
- Create: `apps/web/app/(university)/university/layout.tsx`
- Create: `apps/web/components/university/university-payments-table.tsx`
- Create: `apps/web/app/(admin)/admin/university-payments/page.tsx`
- Create: `apps/web/components/admin/university-payments/university-payment-admin-forms.tsx`

**Interfaces:**
- Consumes: `useUniversityStaffPayments`, `useConfirmUniversityPayment`, `UniversityPaymentItem` from Task 8; shared `Card`, `Button`, `Table`, `Badge`, `Skeleton`.
- Produces: `/university/payments` staff page and `/admin/university-payments` admin page.

- [ ] **Step 1: Verify baseline build before adding screens**

Run: `cd apps/web && pnpm build`
Expected: PASS. This task adds rendering-only screens over hooks tested in Task 8; its verification is the build plus the Task 11 smoke checklist.

- [ ] **Step 2: Record the baseline**

No test file is added here. `@testing-library/react` is not installed, and the plan does not add a dependency for render-only screens.

- [ ] **Step 3: Implement staff table**

```tsx
"use client";

import { Button, Card, Badge } from "@/ui";
import { toast } from "sonner";
import {
  useUniversityStaffPayments,
  useConfirmUniversityPayment,
} from "@/domains/university-payments";

export function UniversityPaymentsTable() {
  const { data: payments, isLoading } = useUniversityStaffPayments();
  const confirm = useConfirmUniversityPayment();

  if (isLoading) return <Card className="p-5">Loading payments…</Card>;
  if (!payments?.length) {
    return <Card className="p-5">No university payments received yet.</Card>;
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <Card key={payment.id} className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium">
              ₹{payment.amountINR.toLocaleString("en-IN")} · {payment.currency}
            </p>
            <p className="text-xs text-gray-500">Txn {payment.txnid}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>{payment.status}</Badge>
            {payment.confirmedAt ? (
              <span className="text-xs text-green-700">Confirmed</span>
            ) : payment.status === "SUCCESS" ? (
              <Button
                size="sm"
                disabled={confirm.isPending}
                onClick={async () => {
                  try {
                    await confirm.mutateAsync({
                      id: payment.id,
                      note: "Confirmed by university staff",
                    });
                    toast.success("Receipt confirmed");
                  } catch {
                    toast.error("Could not confirm receipt");
                  }
                }}
              >
                Confirm receipt
              </Button>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Implement staff layout and page**

`apps/web/app/(university)/university/layout.tsx`:

```tsx
"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireUniversity>{children}</ProtectedRoute>;
}
```

`apps/web/app/(university)/university/payments/page.tsx`:

```tsx
import { UniversityPaymentsTable } from "@/components/university/university-payments-table";

export default function UniversityPaymentsPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">University payments</h1>
      <p className="text-sm text-gray-600">
        Confirm receipt after PayU settles the tuition amount to your bank account.
      </p>
      <UniversityPaymentsTable />
    </main>
  );
}
```

- [ ] **Step 5: Implement admin forms**

`apps/web/components/admin/university-payments/university-payment-admin-forms.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button, Card } from "@/ui";
import { client } from "@/shared/api/client";
import { toast } from "sonner";

export function UniversityPaymentAdminForms() {
  const [applicationId, setApplicationId] = useState("");
  const [amountINR, setAmountINR] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [universityId, setUniversityId] = useState("");
  const [merchantKey, setMerchantKey] = useState("");
  const [salt, setSalt] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffPhone, setStaffPhone] = useState("");

  async function submit(path: string, body: object, success: string) {
    try {
      await client.post(path, body);
      toast.success(success);
    } catch {
      toast.error("Save failed");
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="space-y-2 p-4">
        <h2 className="font-medium">Create payment request</h2>
        <input className="w-full rounded border p-2 text-sm" placeholder="Application ID" value={applicationId} onChange={(e) => setApplicationId(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" placeholder="Amount INR (max 2500000)" value={amountINR} onChange={(e) => setAmountINR(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" placeholder="Settlement currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        <Button size="sm" onClick={() => submit("/admin/university-payment-requests", { applicationId, amountINR: Number(amountINR), currency }, "Request created")}>Create request</Button>
      </Card>
      <Card className="space-y-2 p-4">
        <h2 className="font-medium">University PayU credentials</h2>
        <input className="w-full rounded border p-2 text-sm" placeholder="University ID" value={universityId} onChange={(e) => setUniversityId(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" placeholder="Merchant key" value={merchantKey} onChange={(e) => setMerchantKey(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" type="password" placeholder="Salt (write-only)" value={salt} onChange={(e) => setSalt(e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enabled</label>
        <Button size="sm" onClick={() => submit("/admin/university-payu-credentials", { universityId, merchantKey, salt, enabled }, "Credentials saved")}>Save credentials</Button>
      </Card>
      <Card className="space-y-2 p-4">
        <h2 className="font-medium">Create university staff login</h2>
        <input className="w-full rounded border p-2 text-sm" placeholder="University ID" value={universityId} onChange={(e) => setUniversityId(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" placeholder="Staff name" value={staffName} onChange={(e) => setStaffName(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" placeholder="10-digit phone" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} />
        <Button size="sm" onClick={() => submit("/admin/university-staff", { universityId, name: staffName, phone: staffPhone }, "Staff created")}>Create staff</Button>
      </Card>
    </div>
  );
}
```

`apps/web/app/(admin)/admin/university-payments/page.tsx`:

```tsx
import { UniversityPaymentAdminForms } from "@/components/admin/university-payments/university-payment-admin-forms";

export default function AdminUniversityPaymentsPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">University payments</h1>
      <UniversityPaymentAdminForms />
    </main>
  );
}
```

- [ ] **Step 6: Add admin sidebar link**

In `apps/web/components/admin/admin-sidebar.tsx`, add to the nav items:

```ts
  { label: "University Payments", href: "/admin/university-payments", icon: CreditCard },
```

Add `CreditCard` to the existing `lucide-react` import.

- [ ] **Step 7: Run tests and builds**

Run:
```bash
cd apps/api && pnpm test && pnpm build
cd apps/web && pnpm test && pnpm build
```
Expected: all PASS.

- [ ] **Step 8: Verification checkpoint (no commit)**

Run the same two commands. Expected: PASS. Do not run `git commit`.

---

### Task 11: Final integration verification

**Files:** none. Verification only.

**Interfaces:**
- Consumes: all routes and hooks from Tasks 4–10.

- [ ] **Step 1: Run full verification**

```bash
cd apps/api && pnpm prisma generate && pnpm test && pnpm build
cd apps/web && pnpm test && pnpm build
```

Expected: all commands exit 0. Record any failure with exact command + error output; fix the responsible task, then rerun from that task onward.

- [ ] **Step 2: Manual smoke checklist (local, no live money)**

1. Start API + web with PayU test credentials and `UNIVERSITY_PAYU_SALT_ENCRYPTION_KEY` set to a 64-char hex string.
2. Admin: create request for an existing application with `amountINR = 1000`.
3. Admin: save test PayU credentials for that university, `enabled = true`; create a UNIVERSITY staff login.
4. Student: open `/student/payments`, submit PAN `ABCDE1234F` + billing address → redirected to `test.payu.in/_payment` with `lrs_service_type=education_non_loan`.
5. PayU test success → `/payments/university/verify` shows "Payment captured".
6. University staff: `/university/payments` shows the successful payment; confirm receipt → badge changes to Confirmed.
7. Repeat step 4 as a linked parent; repeat with an unlinked parent → 403.
8. Set credentials `enabled = false` → initiate shows the clear block message.

- [ ] **Step 3: Confirm no commit was made**

Run: `git status --short`
Expected: modified/untracked files present, no new commit. Do not run `git commit`.

---

## Plan self-review notes

- Every spec section has a task: research/fund flow (Tasks 4–7), data model (Task 1), API (Tasks 4–7), UI (Tasks 8–10), errors (Tasks 1, 4–6), security (Tasks 1, 2, 4–6), tests (Tasks 1–10).
- Spec's `BANK_REMITTANCE` fallback: channel enum + `proofFileKey` column are in Task 1. No UI or endpoint in V1, as specified.
- Spec's `tcsAmount` appears on `UniversityPayment`; it is sourced from `UniversityPaymentRequest.tcsAmount` in Tasks 1/4/5.
- Hash functions reused from `payments/dto/payment.dto.ts`; no duplicate implementation.
- Types kept consistent: `payerRole` is `'STUDENT' | 'PARENT'`; university scope always derived server-side; `Payment` model untouched.
- TCS declaration and PAN are exposed to PayU via `udf3`/`udf5`; only `panLast4` persisted.
