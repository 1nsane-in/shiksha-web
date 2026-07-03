# Application Tracking UI — Flipkart/Myntra-Style Timeline

> Component spec for the visual application progress tracker.

---

## 1. Design Goals

- **At-a-glance progress**: Student opens their application → instantly sees where they are
- **Actionable**: Active step shows exactly what to do next (upload docs, pay fee, etc.)
- **Reassuring**: Completed steps show checkmarks, dates, and confirmations
- **Mobile-first**: Indian students primarily use phones

---

## 2. Component: `ApplicationTimeline`

### Data Shape (from API)

```typescript
interface TimelineEvent {
  id: string;
  stage: number;
  event: string;        // machine key
  title: string;        // human-readable
  description: string | null;
  metadata: {
    amount?: number;     // payment amount
    currency?: string;
    fileUrl?: string;    // letter/doc link
    examDate?: string;
    result?: string;
  } | null;
  occurredAt: string;    // ISO date
  isActive: boolean;     // is this the current step?
  isCompleted: boolean;  // was this step done?
}

interface TimelineResponse {
  currentStage: number;
  currentStatus: string;
  events: TimelineEvent[];
  stages: StageInfo[];
}

interface StageInfo {
  stage: number;
  label: string;
  status: 'completed' | 'active' | 'pending' | 'locked';
  actionLabel?: string;   // "Pay ₹5,000", "Upload Documents"
  actionUrl?: string;     // link to action page
}
```

### Visual States

```
COMPLETED STEP (green)
┌──────────────────────────────────────────────┐
│  ●  Application Submitted                    │
│     May 20, 2026 at 10:30 AM                 │
│     ─ Osh State University                   │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│

ACTIVE STEP (blue, pulsing indicator)
┌──────────────────────────────────────────────┐
│  ◎  Admission Fee Required                   │
│     Action needed                             │
│     ─ Pay ₹5,000 to confirm your seat        │
│     ┌─────────────────┐                      │
│     │   Pay Now →      │                      │
│     └─────────────────┘                      │
│- - - - - - - - - - - - - - - - - - - - - - -│

PENDING STEP (grey)
┌──────────────────────────────────────────────┐
│  ○  Entrance Exam                             │
│     Will be available after payment           │
│- - - - - - - - - - - - - - - - - - - - - - -│

LOCKED STEP (grey, locked icon)
┌──────────────────────────────────────────────┐
│  🔒  Invitation Letter                        │
│     Complete previous steps to unlock         │
└──────────────────────────────────────────────┘
```

### 2.1 Stage Configuration

```typescript
const STAGE_CONFIG = [
  {
    stage: 1,
    label: 'Initial Application',
    icon: 'FileText',
    description: 'Submit your application to the university',
  },
  {
    stage: 2,
    label: 'Admission Letter & Confirmation',
    icon: 'Mail',
    description: 'Receive admission letter and pay confirmation fee',
    payment: { amount: 5000, label: 'Admission Confirmation Fee' },
  },
  {
    stage: 3,
    label: 'Entrance Examination',
    icon: 'BookOpen',
    description: 'Register, submit documents, and appear for exam',
    payment: { amount: 10000, label: 'Examination Fee' },
    documents: ['Passport', '12th Marksheet', 'Notarized & Translated Copies'],
  },
  {
    stage: 4,
    label: 'Invitation Letter',
    icon: 'Award',
    description: 'Receive your official invitation letter',
  },
  {
    stage: 5,
    label: 'Visa & Support',
    icon: 'Plane',
    description: 'Visa assistance and support tickets',
  },
];
```

### 2.2 Responsive Layout

**Desktop (≥768px):** Vertical timeline, events on the right, time on the left
**Mobile (<768px):** Vertical timeline, compact layout, swipeable

---

## 3. Page Integration

### Student Dashboard — `/student/applications/:id`

```
┌──────────────────────────────────────────────────────────────┐
│  My Application                                              │
│  Osh State University — MBBS                                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Stage Progress: Step 2 of 5                         │   │
│  │  ████████████░░░░░░░░░░░░░░░ 40%                     │   │
│  │                                                      │   │
│  │  ● Application Submitted          May 20 ✔           │   │
│  │  ● Admission Letter Issued        Jun 5  ✔           │   │
│  │  ◎ Pay ₹5,000 to Confirm Seat     ← YOU ARE HERE     │   │
│  │  ○ Entrance Exam                                      │   │
│  │  ○ Invitation Letter                                  │   │
│  │  ○ Visa & Support                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Current Action Required                              │   │
│  │                                                      │   │
│  │  📄 Admission Letter Issued                          │   │
│  │  Your admission letter from Osh State University     │   │
│  │  is ready. Please pay ₹5,000 to confirm your seat.   │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌─────────────────────┐          │   │
│  │  │ View Letter  │  │ Pay ₹5,000 Now →    │          │   │
│  │  └──────────────┘  └─────────────────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Admin View — `/admin/applications/:id`

```
┌──────────────────────────────────────────────────────────────┐
│  Student: John Doe — Osh State University                    │
│  Current Stage: 2 (Admission Letter & Payment)               │
│                                                              │
│  📋 Application Info                                         │
│  ● Applied: May 20, 2026                                     │
│  ● Program: MBBS (General Medicine)                          │
│  ● Status: STAGE_2_PENDING                                   │
│                                                              │
│  📄 Stage 2 — Admission Letter                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Upload Admission Letter PDF]  ✓ Uploaded Jun 5     │   │
│  │  [Replace Letter]                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  💰 Payment Status: PENDING (₹5,000)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ● Order ID: order_xxxxx                             │   │
│  │  ● Created: Jun 8, 2026                              │   │
│  │  ● Status: Awaiting payment                          │   │
│  │  [Manually Mark as Paid]                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [✅ Mark Stage 2 Complete] → Opens Stage 3                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Student Dashboard — At-a-Glance Status

The main student dashboard (`/student/dashboard`) should show a **compact summary** for each application:

```
┌──────────────────────────────────────────────────────────────┐
│  My Applications                                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Osh State University — MBBS                          │   │
│  │  ██████████░░░░░░░░░░░░░░░░░░ 30% | Step 2 of 5     │   │
│  │  Status: ✏️ Action Required — Pay ₹5,000             │   │
│  │  Last updated: Jun 8, 2026                           │   │
│  │                                    [View Details →]  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Kyrgyz National University — MBBS                    │   │
│  │  ████████████████████░░░░░░░░ 50% | Step 3 of 5     │   │
│  │  Status: 📅 Exam on July 15, 2026                    │   │
│  │  Last updated: Jun 10, 2026                          │   │
│  │                                    [View Details →]  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Empty & Loading States

### No Applications Yet
```
┌──────────────────────────────────────────────────────────────┐
│  You haven't applied to any universities yet.                │
│                                                              │
│  ┌──────────────────────────────┐                            │
│  │  Browse Universities →       │                            │
│  └──────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────┘
```

### Loading State
```
┌──────────────────────────────────────────────────────────────┐
│  ⏳ Loading your application status...                       │
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│  ░░░░░░░░░░░░░░░░░░░░░░░░                                   │
└──────────────────────────────────────────────────────────────┘
```

### Error State
```
┌──────────────────────────────────────────────────────────────┐
│  ⚠️ Could not load application details                      │
│  Please try again or contact support.                        │
│  [Retry] [Contact Support]                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Mobile-Specific UI Behavior

### 6.1 Sticky Bottom CTA

On mobile, the current action button must be **sticky at the bottom** of the viewport:

```
┌─────────────────────┐
│                     │
│  [Timeline content  │
│   scrollable area]  │
│                     │
│                     │
│                     │
│                     │
├─────────────────────┤  ← sticky at bottom
│  Pay ₹5,000 Now →  │  ← min 56px height, 44px tap target
└─────────────────────┘
```

- Always visible while scrolling the timeline
- Text changes based on current stage action
- Greyed out if stage requires admin action first (e.g., "Awaiting Admission Letter")
- Bottom safe area padding for notched phones (env(safe-area-inset-bottom))

### 6.2 Camera Integration for Document Upload

When uploading exam documents on mobile:

```
┌─────────────────────┐
│  Upload Document     │
│                     │
│  ┌───────────────┐  │
│  │  📷 Camera    │  │  ← "Take Photo" opens device camera
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │  🖼 Gallery   │  │  ← "Choose from Gallery" opens photo picker
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │  📁 Files     │  │  ← "Browse Files" opens file manager
│  └───────────────┘  │
│                     │
│  Accepted: JPG, PNG, PDF (max 10MB) │
└─────────────────────┘
```

- Camera capture auto-compresses to ≤2MB
- Gallery picker allows multi-select
- Progress bar shown during upload
- Retry button if upload fails

### 6.3 Touch Targets

All interactive elements must have minimum touch targets:

| Element | Minimum Size | Notes |
|---------|-------------|-------|
| Buttons (CTA, secondary) | 44px × 44px | Or 56px height for full-width CTAs |
| Timeline step dots | 32px × 32px | With 6px extra padding (invisible touch area) |
| Icon buttons | 44px × 44px | Back, menu, close |
| File upload cards | 88px height | Easy to tap on scroll |
| Tab bar items | 48px × 32px | Bottom navigation |
| Links in text | 44px min height | Line-height + padding |

### 6.4 Pull-to-Refresh

- Enabled on: timeline, applications list, tickets list, document list
- Shows "Last updated: 2 min ago" after refresh
- Silent refresh in background every 60s when app is visible (no loading indicator)

### 6.5 Skeleton Loaders

Replace all spinners with skeleton screens for perceived performance:

```
┌──────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │  ← title skeleton
│  ▓▓▓▓▓   ▓▓▓▓▓              │  ← date + icon skeleton
│                              │
│  ●━━━━━━━━━━━━━━━━━━━━━━    │  ← line skeleton
│                              │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
│  ▓▓▓▓▓   ▓▓▓▓▓              │
│  ○ - - - - - - - - - - -    │
└──────────────────────────────┘
```

### 6.6 Offline Behavior

| State | Timeline Display | Action Buttons |
|-------|-----------------|----------------|
| **Online** | Live data from API | Fully interactive |
| **Offline (cached)** | Stale data from local storage | Disabled with "Go online to continue" overlay |
| **Offline (no cache)** | Error state: "Connect to internet" + Retry button | Hidden |
| **Reconnecting** | Skeleton on refresh area | Disabled with spinner |

### 6.7 Network-Aware Polling

```typescript
// Adaptive polling based on network state
const pollInterval = useMemo(() => {
  if (isSlowNetwork) return 30000;  // 30s on 3G
  if (isVisible) return 10000;      // 10s when app is in foreground
  return 60000;                      // 60s when backgrounded
}, [isSlowNetwork, isVisible]);
```

### 6.8 Deep Link Routing

Push notification payload includes deep link path for routing:

```typescript
// Push notification data
{
  "type": "admission_letter_uploaded",
  "applicationId": "abc-123",
  "deepLink": "/student/applications/abc-123/timeline"
}
```

---

## 7. Implementation Notes

- Use `shadcn/ui` components: `Stepper` or custom `Timeline` component
- React Hook Form for document upload forms
- TanStack Query for data fetching with optimistic updates + stale-while-revalidate
- Payment flow opens Razorpay checkout modal
- Timeline auto-refreshes on payment success via webhook polling + push notification
- **Mobile-first responsive**: Design for 375px first, expand to desktop
- **Network-aware**: Use `navigator.connection` to detect effective network type
- **Pull-to-refresh**: Use custom or library (react-use-gesture) implementation
- **Skeleton loaders**: Animated placeholder shapes, not spinners
- Icons: Use `lucide-react` icons (FileText, Mail, BookOpen, Award, Plane, Check, Lock, Clock)
- Color scheme: Green (completed), Blue (active), Gray (pending/locked)
- Touch targets: All interactive elements ≥44px

### Key States Per Stage

| State | Visual | Description |
|-------|--------|-------------|
| **Locked** | 🔒 Grey dashed line | Previous steps not complete |
| **Pending** | ○ Grey circle | Available but not started |
| **Active** | ◎ Blue pulsing | Current actionable step |
| **Completed** | ● Green checkmark | Step finished successfully |

### Data Fetching Strategy

```typescript
// TanStack Query configuration
const useApplicationTimeline = (applicationId: string) => {
  return useQuery({
    queryKey: ['application-timeline', applicationId],
    queryFn: () => fetchTimeline(applicationId),
    staleTime: 5 * 60 * 1000,     // 5 min before considered stale
    gcTime: 60 * 60 * 1000,       // 1 hour in cache
    refetchInterval: isVisible ? 30000 : false,  // Poll every 30s when visible
    refetchOnWindowFocus: true,
    // On mobile, prefer cached data while revalidating
    networkMode: 'offlineFirst',
  });
};
```
