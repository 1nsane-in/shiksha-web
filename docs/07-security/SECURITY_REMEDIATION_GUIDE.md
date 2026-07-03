# Security Remediation Quick-Start Guide

## Critical Actions - Execute Immediately

### 1. Rotate All Exposed Credentials (CRITICAL)

**Run this script to identify what needs rotation:**

```bash
#!/bin/bash
# rotate-credentials.sh

echo "=== CRITICAL CREDENTIALS TO ROTATE ==="
echo ""
echo "1. Neon PostgreSQL:"
echo "   - Go to: https://console.neon.tech"
echo "   - Project: shiksha"
echo "   - Reset password and update DATABASE_URL"
echo ""
echo "2. PayU Credentials:"
echo "   - Contact PayU support"
echo "   - Request new key/salt pair"
echo "   - Update PAYU_KEY and PAYU_SALT"
echo ""
echo "3. Cloudflare R2:"
echo "   - Go to: https://dash.cloudflare.com"
echo "   - R2 > Manage API Tokens"
echo "   - Revoke old tokens, create new ones"
echo ""
echo "4. Google OAuth:"
echo "   - Go to: https://console.cloud.google.com/apis/credentials"
echo "   - Delete current OAuth 2.0 credentials"
echo "   - Create new credentials"
echo "   - Update both web and API .env files"
echo ""
echo "5. JWT Secret:"
echo "   - Generate new secret:"
echo "     node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
echo "   - Update JWT_SECRET in production"
echo ""
```

### 2. Fix JWT Secret Fallback (CRITICAL)

**File:** `apps/api/src/auth/guards/jwt-auth.guard.ts`

```typescript
// BEFORE (VULNERABLE):
const payload = await this.jwtService.verifyAsync(token, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
});

// AFTER (SECURE):
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (secret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}
const payload = await this.jwtService.verifyAsync(token, { secret });
```

### 3. Add Payment Webhook Signature Verification (CRITICAL)

**File:** `apps/api/src/payments/payments.controller.ts`

```typescript
import { Headers, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Public()
@Post('verify')
async verify(
  @Body() dto: VerifyPayUPaymentDto,
  @Headers('x-payu-signature') signature: string
) {
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.PAYU_WEBHOOK_SECRET!)
    .update(JSON.stringify(dto))
    .digest('hex');
  
  if (!crypto.timingSafeEqual(
    Buffer.from(signature || ''),
    Buffer.from(expectedSignature)
  )) {
    throw new UnauthorizedException('Invalid webhook signature');
  }
  
  return this.paymentsService.verifyPayment(dto);
}
```

### 4. Add File Upload Magic Byte Validation (HIGH)

**File:** `apps/api/src/common/controllers/upload.controller.ts`

```typescript
const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
};

function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
  const signatures = FILE_SIGNATURES[mimeType];
  if (!signatures) return false;
  
  return signatures.some(sig => 
    sig.every((byte, i) => buffer[i] === byte)
  );
}

// In uploadFile method:
if (!validateFileSignature(file.buffer, file.mimetype)) {
  throw new BadRequestException('File content does not match declared type');
}
```

### 5. Add Security Headers (HIGH)

**File:** `apps/api/src/main.ts`

```typescript
import helmet from 'helmet';

// Add after app creation
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Additional headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

### 6. Add Rate Limiting to Auth Endpoints (HIGH)

**File:** `apps/api/src/common/rate-limiting/rate-limiting.module.ts`

```typescript
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,
    limit: 3,
  },
  {
    name: 'auth',
    ttl: 60000,
    limit: 5,
  },
  {
    name: 'forgot-password',
    ttl: 3600000, // 1 hour
    limit: 3,
  },
]),
```

**File:** `apps/api/src/auth/auth.controller.ts`

```typescript
import { Throttle } from '@nestjs/throttler';

@Public()
@Throttle('forgot-password')
@Post('forgot-password')
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto);
}
```

### 7. Fix Path Traversal in File Delete (HIGH)

**File:** `apps/api/src/common/controllers/upload.controller.ts`

```typescript
@Delete()
async deleteFile(@Query('key') key: string) {
  if (!key) {
    throw new BadRequestException('No key provided');
  }
  
  // Prevent path traversal
  if (key.includes('..') || key.startsWith('/') || key.includes('\\')) {
    throw new BadRequestException('Invalid key');
  }
  
  const allowedFolders = ['logos', 'banners', 'brochures', 'documents', 'gallery', 
                         'avatars', 'uploads', 'admission-letters', 'invitation-letters'];
  const folder = key.split('/')[0];
  
  if (!allowedFolders.includes(folder)) {
    throw new BadRequestException('Invalid folder');
  }
  
  await this.storage.delete(key);
  return { success: true };
}
```

### 8. Fix CORS Null Origin (MEDIUM)

**File:** `apps/api/src/main.ts`

```typescript
origin: (origin, callback) => {
  // Reject null origin in production
  if (!origin && process.env.NODE_ENV === 'production') {
    return callback(new Error('Origin required in production'), false);
  }
  
  if (!origin) {
    return callback(null, true); // Only in development
  }
  
  // ... rest of validation
},
```

### 9. Sanitize Request Body Logging (MEDIUM)

**File:** `apps/api/src/main.ts`

```typescript
const SENSITIVE_FIELDS = ['password', 'token', 'creditCard', 'cvv', 'otp'];

function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') return body;
  
  const sanitized = { ...body };
  for (const field of SENSITIVE_FIELDS) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }
  return sanitized;
}

// Update logging middleware
if (req.body && Object.keys(req.body).length > 0) {
  logger.debug(`Request Body: ${JSON.stringify(sanitizeBody(req.body))}`);
}
```

### 10. Add Account Lockout (MEDIUM)

**File:** `apps/api/src/auth/auth.service.ts`

```typescript
async login(dto: LoginDto, ip: string) {
  // Check recent failed attempts
  const recentFailures = await this.prisma.loginAttempt.count({
    where: {
      email: dto.email,
      success: false,
      createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });
  
  if (recentFailures >= 5) {
    throw new UnauthorizedException('Account temporarily locked. Try again in 15 minutes.');
  }
  
  // ... validate credentials
  
  if (!isPasswordValid) {
    await this.prisma.loginAttempt.create({
      data: { email: dto.email, ipAddress: ip, success: false },
    });
    throw new UnauthorizedException('Invalid credentials');
  }
  
  // Clear failures on success
  await this.prisma.loginAttempt.deleteMany({
    where: { email: dto.email, success: false },
  });
  
  // ... return tokens
}
```

---

## Environment Variables Checklist

Create a `.env.example` file (DO NOT include real values):

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# JWT
JWT_SECRET="generate-a-64-character-random-string-here-at-least-32-chars"

# PayU
PAYU_KEY=""
PAYU_SALT=""
PAYU_BASE_URL="https://secure.payu.in"
PAYU_WEBHOOK_SECRET=""

# R2 Storage
R2_ENDPOINT=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Resend Email
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""

# Sentry
SENTRY_DSN=""

# PostHog
POSTHOG_KEY=""
POSTHOG_HOST=""

# App
NODE_ENV="production"
PORT="8000"
FRONTEND_URL="https://your-domain.com"
```

---

## Pre-Deployment Security Checklist

- [ ] All credentials rotated
- [ ] JWT fallback removed
- [ ] Security headers added
- [ ] Rate limiting configured
- [ ] File upload validated
- [ ] Payment webhooks verified
- [ ] CORS tightened
- [ ] Sensitive data redacted from logs
- [ ] Dependencies updated
- [ ] Security tests passing
- [ ] Penetration test completed
- [ ] Incident response plan documented

---

## Testing Commands

```bash
# Check for hardcoded secrets
grep -r "password\|secret\|key\|token" apps/api/src --include="*.ts" | grep -v "process.env"

# Check JWT configuration
grep -r "JWT_SECRET" apps/api/src --include="*.ts"

# Check for SQL injection patterns
grep -r "\\$.*query\|exec.*\\$" apps/api/src --include="*.ts"

# Check CORS configuration
grep -r "enableCors\|origin.*true" apps/api/src --include="*.ts"

# Check helmet/security headers
grep -r "helmet\|X-Frame-Options\|Content-Security" apps/api/src --include="*.ts"

# Run security audit
npm audit --audit-level=moderate
```

---

*Last updated: 2026-06-22*
*Document version: 1.0*
