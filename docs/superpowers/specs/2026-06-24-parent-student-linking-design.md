# Parent-Student Linking System — Design Spec

## Overview

Enable parents to link their account to their child's (student's) account so they can view application progress, documents, payments, and support their child through the admission process.

## Core Relationship

- Many-to-many: A parent can have multiple children, a student can have multiple parents/guardians
- Links are tracked through a `ParentStudent` join table with status (PENDING / APPROVED / REJECTED)
- Two linking methods in V1: **Invite Link** (Method C) and **Family Code** (Method D)
- Student-initiated flows auto-approve the link
- Parent-initiated claims need student approval (not in V1 scope yet)

---

## 1. Schema Changes

### New Enum
```prisma
enum ParentLinkStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### New Model: `ParentStudent`
```prisma
model ParentStudent {
  id         String           @id @default(uuid())
  parentId   String
  studentId  String
  relation   String?          // FATHER, MOTHER, GUARDIAN
  status     ParentLinkStatus @default(PENDING)
  invitedBy  String           // STUDENT | PARENT | ADMIN
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt

  parent  Parent  @relation(fields: [parentId], references: [id], onDelete: Cascade)
  student Student @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([parentId, studentId])
  @@index([parentId])
  @@index([studentId])
  @@index([status])
}
```

### New Model: `ParentInvite`
```prisma
model ParentInvite {
  id         String   @id @default(uuid())
  studentId  String
  email      String?
  phone      String?
  relation   String?
  code       String   @unique    // unique token
  method     String   // LINK | CODE
  status     String   @default("PENDING") // PENDING | ACCEPTED | EXPIRED
  expiresAt  DateTime
  createdAt  DateTime @default(now())

  student Student @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@index([code])
  @@index([studentId])
}
```

### Student Model Additions
```prisma
model Student {
  // ... existing fields ...

  familyCode     String?        @unique   // 6-char regeneratable code
  parentInvites  ParentInvite[]
  parentLinks    ParentStudent[]
}
```

### Parent Model Additions
```prisma
model Parent {
  // ... existing fields ...

  childLinks ParentStudent[]
}
```

---

## 2. Student Dashboard — "Add Parent"

### Method C: Share Invite Link
```
[Add Parent] → [Share Link]
```
- Generates unique invite link with token
- Student copies and shares via any channel (WhatsApp, SMS, email)
- Link expires after configurable duration (default: 7 days)
- One-time use only
- **Auto-approves** parent on registration (student initiated)

**Backend endpoint:** `POST /api/parents/invite-link`
- Creates `ParentInvite` record with `method: "LINK"`
- Returns shareable URL: `https://shiksha.study/invite/{code}`

### Method D: Family Code
```
[Add Parent] → [Family Code]
```
- Student sees a persistent 6-character code (e.g. "AB12CD")
- Can regenerate code (old code becomes invalid)
- Multiple parents can use the same code
- Parent enters code during registration → auto-approved
- Code doesn't expire unless regenerated

**Backend endpoint:** `GET /api/parents/family-code`
- Returns current `familyCode` from Student model
- If null, auto-generates on first request

**Backend endpoint:** `POST /api/parents/regenerate-family-code`
- Generates new 6-char alphanumeric code
- Replaces old code (old code invalidated)

### Parent Links List (Student Dashboard)
Student sees all linked parents with status:
```
My Parents
┌─────────────────────────────────┐
│ 👩 Mother (anita@email.com)     │
│    ✅ APPROVED                  │
│    [Remove]                     │
├─────────────────────────────────┤
│ 📄 Invite Link sent             │
│    ⏳ Not yet used              │
│    [Resend] [Cancel]            │
└─────────────────────────────────┘
```

**Backend endpoint:** `GET /api/parents/my-links`
**Backend endpoint:** `DELETE /api/parents/link/{id}` (remove parent)

---

## 3. Parent Registration Flow

### Via Invite Link
1. Parent clicks `https://shiksha.study/invite/{code}`
2. System validates code (exists, not expired, not used)
3. Registration form pre-filled with:
   - **Email** — locked (from invite)
   - **Student Name** — read-only display
   - **Relation** — pre-filled or selectable
4. Parent fills:
   - **Name** (required)
   - **Phone** (required, for SMS alerts)
   - **Password** (required, for login)
5. Email OTP sent to pre-filled email
6. Phone OTP sent to parent's phone
7. Both OTPs verified → account created + `ParentStudent` link created as **APPROVED**
8. Redirected to parent dashboard

### Via Family Code
1. Parent registers normally (email, name, phone, password)
2. Email OTP + Phone OTP verification
3. After successful registration, shown "Link to your child" screen
4. Parent enters 6-char family code
5. System finds student with matching code → creates link as **APPROVED**
6. If code invalid, show error "Please check the code with your child"
7. Parent can skip and link later from dashboard banner

### Registration API
```http
POST /api/auth/parent-register
{
  "inviteCode": "AB12CD",   // optional, from invite link
  "name": "Anita Sharma",
  "email": "anita@email.com",
  "phone": "+919876543210",
  "password": "securePass123"
}
```

```http
POST /api/auth/parent-verify-email-otp
{ "email": "anita@email.com", "otp": "123456" }
```

```http
POST /api/auth/parent-verify-phone-otp
{ "phone": "+919876543210", "otp": "654321" }
```

```http
POST /api/parents/link-by-code
{ "familyCode": "AB12CD" }
```

---

## 4. Parent Dashboard

### My Children Overview
Parent sees all linked students:
```
My Children
┌──────────────────────────────────────────┐
│ 👨‍🎓 Rahul Sharma  (Son)                  │
│ Stage: 3/5  ████████░░░  60%            │
│ 📋 Documents: 5/8                       │
│ 💳 Payments: Stage 1 ✅, Stage 2 ✅      │
│ [View Full Dashboard →]                 │
└──────────────────────────────────────────┘
```

### Link Banner (if no children linked)
```
┌─────────────────────────────────────────────┐
│  📌 Link to your child                       │
│  Enter your child's family code to get       │
│  started. Ask them to share it with you.     │
│                                              │
│  Family Code: ──────────  [Link Child]      │
└─────────────────────────────────────────────┘
```

### API Endpoints (Parent)
- `GET /api/parents/children` — list linked students with progress
- `GET /api/parents/children/{childId}/details` — full student details
- `GET /api/parents/children/{childId}/documents` — student documents (read-only)
- `GET /api/parents/children/{childId}/payments` — student payment history

---

## 5. Admin Panel

```
Admin → Parent-Student Links
```
- View all `ParentStudent` records with status filter
- Manually create APPROVED link (search parent + student)
- Approve/reject pending requests
- Unlink (remove existing)
- View link history and audit log

### API Endpoints (Admin)
- `GET /api/admin/parent-links` — list all links (paginated, filtered)
- `POST /api/admin/parent-links` — create link (auto-APPROVED)
- `PATCH /api/admin/parent-links/{id}` — update status
- `DELETE /api/admin/parent-links/{id}` — remove link

---

## 6. Registration Form Changes (Invite Link)

Parent clicking invite link sees a modified registration form:

| Field | Source | Behavior |
|-------|--------|----------|
| Email | From invite token | Locked, pre-filled, cannot edit |
| Student Name | From invite token | Read-only display |
| Relation | From invite token | Pre-filled, user can change |
| Parent Name | User input | Required |
| Phone | User input | Required |
| Password | User input | Required |
| Confirm Password | User input | Required |

OTP flow: Email OTP → Phone OTP → Both verified → Account created → Link approved

---

## 7. Key Business Rules

| Scenario | Behavior |
|----------|----------|
| Invite link expired | Show "Link expired. Ask student to send a new invite." |
| Invite link already used | Show "This link has already been used." |
| Parent already has account | Login then auto-link (if valid invite) |
| Family code incorrect | Show "Code not found. Please check with your child." |
| Link already exists | Show "You're already linked to this student." |
| Student removes parent link | Parent loses access to student data |
| Parent has multiple children | Each child shown as separate card in dashboard |
| Student has multiple parents | Each parent can independently view student data |

---

## 8. Authorization Rules

- Parent can only view **linked** student's data (read-only)
- Parent cannot edit student's applications, documents, or payments
- Parent cannot submit documents or make payments (student-only actions in V1)
- Admin can view/manage all links
- Student can only manage their own parent links
- Unlinking requires auth (student removes parent, admin removes any)

---

## 9. API Endpoint Summary

### Student Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/parents/invite-link` | Generate invite link |
| GET | `/api/parents/family-code` | Get current family code |
| POST | `/api/parents/regenerate-family-code` | Regenerate family code |
| GET | `/api/parents/my-links` | List linked parents |
| DELETE | `/api/parents/link/{id}` | Remove parent link |

### Registration Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/parent-register` | Register with invite code |
| POST | `/api/auth/parent-verify-email-otp` | Verify email OTP |
| POST | `/api/auth/parent-verify-phone-otp` | Verify phone OTP |
| POST | `/api/parents/link-by-code` | Link by family code |

### Parent Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/parents/children` | List linked children |
| GET | `/api/parents/children/{id}/progress` | View child's progress |
| GET | `/api/parents/children/{id}/documents` | View child's documents |
| GET | `/api/parents/children/{id}/payments` | View child's payments |

### Admin Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/parent-links` | List all links |
| POST | `/api/admin/parent-links` | Create link |
| PATCH | `/api/admin/parent-links/{id}` | Update link status |
| DELETE | `/api/admin/parent-links/{id}` | Remove link |

---

## 10. Future Scope (Post-V1)

- Parent-initiated linking (parent enters student email/ID → student approves)
- Email/SMS invite delivery (Method A & B)
- Parent notifications (student stage changes, document updates)
- Parent making payments on behalf of student
- WhatsApp-based linking
