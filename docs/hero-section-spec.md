# Hero Section — MedVue (Medical Admission Platform)

> **Status:** Draft / Ready for Review  
> **Stack:** React + TypeScript + Tailwind CSS + Vite  
> **Target:** Medical Admission Management Platform landing page

---

## Table of Contents

- [1. Video Background](#1-video-background)
- [2. Color Theme (Design Tokens)](#2-color-theme-design-tokens)
- [3. Typography (Global)](#3-typography-global)
- [4. Navbar](#4-navbar)
- [5. Hero Content (Bottom of Viewport)](#5-hero-content-bottom-of-viewport)
- [6. Liquid Glass CSS](#6-liquid-glass-css)
- [7. Components](#7-components)
- [8. Content Recommendations](#8-content-recommendations)
- [9. Video Style Guide](#9-video-style-guide)
- [10. Full Layout Mock](#10-full-layout-mock)
- [11. Content Comparison Table](#11-content-comparison-table)
- [12. Decision Log](#12-decision-log)

---

## 1. Video Background

| Property | Value |
|---|---|
| Position | Full-screen, absolutely positioned |
| Object fit | `object-cover` (cover entire viewport) |
| URL | *(replace with your CDN URL — upload to Cloudflare R2 or S3)* |
| Attributes | `autoplay`, `loop`, `muted`, `playsInline` |
| Overlay | **None.** No dark overlay, no gradient, no semi-transparent layer. The video plays raw with no dimming. |

### Recommended Video Styles

| Style | Vibe | Best For |
|---|---|---|
| White coat ceremony / graduation | Aspirational, emotional | "This could be you" — **RECOMMENDED** |
| Modern hospital / medical campus | Trust, scale, professionalism | "We're connected to real institutions" |
| Abstract medical tech (DNA, data) | Innovation, cutting-edge | "We use tech to simplify admissions" |
| University campus sunrise | Hope, new beginnings | "Your journey starts here" |
| Students in labs / lecture halls | Academic rigor, focus | "Serious education ahead" |

---

## 2. Color Theme (Design Tokens)

> **These are your project's established tokens — do not change them.**

```ts
const theme = {
  ink:       "#1A153A",   // Deep navy-purple — primary background
  inkMuted:  "#6B6599",   // Muted purple — secondary text, subdued elements
  gold:      "#C4953B",   // Gold — accent for CTAs, highlights, hover states
  goldLight: "rgba(196, 149, 59, 0.10)", // Subtle gold wash
  goldGlow:  "rgba(196, 149, 59, 0.18)", // Glow effect
  canvas:    "#FAF9F6",   // Warm off-white — primary text on dark surfaces
  surface:   "#FFFFFF",   // Pure white — buttons, cards, high-contrast surfaces
  hairline:  "rgba(26, 21, 58, 0.08)", // Subtle border on light surfaces
  purpleLight: "rgba(75, 45, 142, 0.06)", // Subtle purple tint
};
```

### Token → Usage Mapping

| Token | Where It's Used |
|---|---|
| `ink` (`#1A153A`) | Page/section background, button text (on light bg) |
| `canvas` (`#FAF9F6`) | Primary text (headings, nav links on dark) |
| `surface` (`#FFFFFF`) | CTA button background, card surfaces |
| `inkMuted` (`#6B6599`) | Subheading text, secondary labels, subdued nav links |
| `gold` (`#C4953B`) | Logo text, hover highlights, accent glow |
| `goldLight` | Glass backgrounds, hover tints |
| `hairline` | Borders between elements (on light backgrounds) |
| `purpleLight` | Subtle section backgrounds, glass base |

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ink:       "#1A153A",
        "ink-muted": "#6B6599",
        gold:      "#C4953B",
        "gold-light": "rgba(196, 149, 59, 0.10)",
        "gold-glow": "rgba(196, 149, 59, 0.18)",
        canvas:    "#FAF9F6",
        surface:   "#FFFFFF",
        hairline:  "rgba(26, 21, 58, 0.08)",
        "purple-light": "rgba(75, 45, 142, 0.06)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

> **Then use Tailwind classes like:** `bg-ink`, `text-canvas`, `text-ink-muted`, `border-white/10`, `bg-gold`, `hover:text-gold`, etc.

---

## 3. Typography (Global)

### Google Fonts Import (in `index.html`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Global CSS (in `globals.css` or `index.css`)

```css
body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 4. Navbar

### Layout

```
┌─────────────────────────────────────────┐
│  px-6 md:px-12 lg:px-16                 │
│  ┌─────────────────────────────────┐    │
│  │ MedVue    Students  Universities │    │
│  │           Applications  Support  │    │
│  │                        [Get St.]│    │
│  └─────────────────────────────────┘    │
│  pt-6                                    │
└─────────────────────────────────────────┘
```

### Specs

| Element | Class / Style | Details |
|---|---|---|
| **Wrapper** | `px-6 md:px-12 lg:px-16 pt-6` | Horizontal page padding + top padding |
| **Nav bar** | `.liquid-glass`, `rounded-xl`, `px-4 py-2` | Glass effect, flex layout |
| **Layout** | `flex items-center justify-between` | Logo left, links center, CTA right |
| **Logo** | `"MedVue"` — `text-2xl font-semibold tracking-tight text-gold` | Gold logo for brand distinction |
| **Links** | `"Students"`, `"Universities"`, `"Applications"`, `"Support"` | `text-sm text-ink-muted`, `gap-8`, hover → `text-gold` |
| **Mobile** | Links hidden on mobile, visible on `md+` | Medium breakpoint |
| **CTA** | `"Get Started"` — `bg-surface text-ink px-6 py-2 rounded-lg text-sm font-medium`, hover → `bg-canvas` | Light button on dark glass |

---

## 5. Hero Content (Bottom of Viewport)

### Layout Structure

```tsx
// Outer container — fills viewport
<section className="relative h-screen w-full overflow-hidden bg-ink">
  {/* Video background */}
  <video ... />

  {/* Content stack */}
  <div className="relative z-10 h-full flex flex-col">
    {/* Navbar — uses liquid-glass */}
    <nav className="px-6 md:px-12 lg:px-16 pt-6">...</nav>

    {/* Hero content — pushed to bottom */}
    <div className="flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-12 lg:pb-16">
      {/* lg: grid 2 columns */}
      <div className="lg:grid lg:grid-cols-2 lg:items-end">
        {/* Left column — main content */}
        <div>...</div>
        {/* Right column — tag */}
        <div className="flex items-end justify-start lg:justify-end">...</div>
      </div>
    </div>
  </div>
</section>
```

### 5.1 Heading (Left Column)

**Recommended Text:**
```
"From application\n to white coat."
```
> Literal line break between "application" and "to"

**Alternative Options (Choose One):**

| # | Text | Vibe |
|---|---|---|
| **A** | `"From application\n to white coat."` | Short, emotional, story-driven — **RECOMMENDED** |
| **B** | `"Your journey to\n medical excellence starts here."` | Aspirational, safe, professional |
| **C** | `"Admissions simplified.\n Dreams realized."` | Trust-building, friction-reducing |
| **D** | `"The path to medicine\n made clear."` | Calm, confident, guiding |
| **E** | `"Your future in medicine\n begins with one application."` | High-stakes, action-oriented |

**Styling:**

| Property | Value |
|---|---|
| Responsive sizes | `text-4xl md:text-5xl lg:text-6xl xl:text-7xl` |
| Font weight | `font-normal` |
| Bottom margin | `mb-4` |
| Letter spacing | `style={{ letterSpacing: '-0.04em' }}` |
| Color | `text-canvas` (warm off-white over ink) |

**Animation — Character-by-character entrance:**
- Start state: `opacity: 0` + `translateX(-18px)`
- End state: `opacity: 1` + `translateX(0)`
- Stagger delay formula: `(lineIndex * lineLength * 30) + (charIndex * 30)`
- Initial delay: `200ms`
- Each char transition: `500ms`
- Spaces render as `\u00A0` (non-breaking space)

### 5.2 Subheading (Left Column)

**Recommended Text:**
```
"We simplify medical admissions so you can focus on what matters — becoming a doctor."
```

**Alternative Options:**

| # | Text |
|---|---|
| **1** | "We simplify medical admissions so you can focus on what matters — becoming a doctor." |
| **2** | "From document uploads to visa support — we guide you through every stage of your medical admission journey." |
| **3** | "Your dream medical school is closer than you think. We make the process clear, guided, and stress-free." |
| **4** | "Apply smarter. Track every stage. Get admitted with confidence." |

**Styling:**

| Property | Value |
|---|---|
| Sizes | `text-base md:text-lg` |
| Color | `text-ink-muted` (`#6B6599`) — replaces `text-gray-300` |
| Bottom margin | `mb-5` |
| Animation | Fade-in: 800ms delay, 1000ms duration |

### 5.3 Buttons (Left Column)

```
┌────────────────────┐  ┌──────────────────────────┐
│  Explore Programs   │  │       Get Started        │
│  bg-surface         │  │  glass + border-white/10 │
│  text-ink           │  │  text-canvas             │
│  px-8 py-3 rounded  │  │  hover: bg-gold          │
│                     │  │  hover: text-ink         │
└────────────────────┘  └──────────────────────────┘
```

| Property | Value |
|---|---|
| Layout | `flex-wrap gap-4` |
| Animation | Fade-in: 1200ms delay, 1000ms duration |

**Button 1 — Primary:**
- Text: `"Explore Programs"`
- `bg-surface text-ink px-8 py-3 rounded-lg font-medium`
- Hover: `bg-canvas text-ink`

**Button 2 — Secondary:**
- Text: `"Get Started"`
- `.liquid-glass border border-white/10 text-canvas px-8 py-3 rounded-lg font-medium`
- Hover: `bg-gold text-ink` — gold fills on hover for a premium feel
- Transition: `transition-colors duration-300`

### 5.4 Tag Card (Right Column)

**Recommended Text:**
```
"Admissions. Guidance. Excellence."
```

**Alignment:**
- `flex items-end justify-start lg:justify-end`

**Alternative Options:**

| # | Text | Vibe |
|---|---|---|
| **A** | `Admissions. Guidance. Excellence.` | Professional, broad — **RECOMMENDED** |
| **B** | `Apply. Track. Succeed.` | Action-oriented, simple |
| **C** | `Students. Universities. Success.` | Ecosystem-focused |
| **D** | `Guided. Supported. Admitted.` | Emotional journey |

**Styling:**

| Property | Value |
|---|---|
| Container | `.liquid-glass border border-white/10 px-6 py-3 rounded-xl` |
| Text sizes | `text-lg md:text-xl lg:text-2xl` |
| Font weight | `font-light` |
| Color | `text-canvas` |
| Decorative dot | Optional gold dot (`bg-gold rounded-full w-1.5 h-1.5 inline-block mr-2`) between words |
| Animation | Fade-in: 1400ms delay, 1000ms duration |

---

## 6. Liquid Glass CSS

> The `.liquid-glass` class adapted for use over the **ink** background. Uses a subtle light wash instead of dark, with a gold-tinted gradient border.

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.04);
  background-blend-mode: luminosity;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.2px;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0) 45%,
    rgba(196, 149, 59, 0.06) 55%,
    rgba(196, 149, 59, 0.12) 80%,
    rgba(196, 149, 59, 0.20) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

> **Design rationale:** The gradient border shifts from white at the top to a subtle gold glow at the bottom — echoing the brand's premium, warm identity. The background uses a whisper-light white wash (`rgba(255,255,255,0.04)`) with blur for the glass effect, since the `ink` background is already dark.

---

## 7. Components

### 7.1 `FadeIn` Component

A wrapper component that fades in its children after a configurable delay.

```tsx
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;     // ms — default 0
  duration?: number;  // ms — default 1000
}
```

- Starts `opacity: 0`
- After `delay` ms via `setTimeout`, sets state → `opacity: 1`
- Uses inline `transitionDuration` style + Tailwind `transition-opacity`

### 7.2 `AnimatedHeading` Component

Splits text by `\n` into lines, then each line into individual characters.

```tsx
interface AnimatedHeadingProps {
  text: string;          // e.g., "From application\n to white coat."
  className?: string;
  charDelay?: number;    // ms per char stagger — default 30
  initialDelay?: number; // ms before animation starts — default 200
  duration?: number;     // ms per char transition — default 500
}
```

- Each character: `inline-block <span>`
- CSS transitions on `opacity` + `transform: translateX()`
- Spaces → `\u00A0` (non-breaking)
- Animation triggers via React state after `initialDelay`

---

## 8. Content Recommendations (Summary)

| Element | Recommended Choice | Why |
|---|---|---|
| **Logo** | `MedVue` — `text-gold` | Modern, short, evokes "medical view/path"; gold stands out |
| **Nav Links** | Students, Universities, Applications, Support — `text-ink-muted`, hover `text-gold` | Maps to platform features; gold hover ties brand together |
| **Nav CTA** | Get Started — `bg-surface text-ink` | Direct, low-friction |
| **Heading** | `"From application / to white coat."` | Emotional, story-driven, 4 words — memorable |
| **Subheading** | "We simplify medical admissions so you can focus on what matters — becoming a doctor." | Aspirational + benefit-driven |
| **Button 1** | Explore Programs — `bg-surface text-ink` | Invites exploration, not commitment |
| **Button 2** | Get Started — glass, hover → `bg-gold text-ink` | Direct CTA; gold hover adds premium feel |
| **Tag Card** | `Admissions. Guidance. Excellence.` — `text-canvas` on glass | Professional, covers full scope |
| **Video** | White coat ceremony → medical campus | Aspirational, emotional resonance |
| **Brand accent** | Gold (`#C4953B`) for logo, hovers, and the liquid glass gradient border | Warm, premium, medical-trustworthy without being cold |

---

## 9. Video Style Guide

### Lighting & Color Considerations

The background is `ink` (`#1A153A` — a deep navy-purple) and the theme uses **gold** accents. Choose video footage that harmonizes:

- ✅ **Warm-toned footage** — golden hour, warm interior lighting
- ✅ **Whites / light tones** — white coats, bright labs, clean hospital interiors
- ✅ **Deep shadows** — footage with rich dark areas blends into the `ink` bg seamlessly
- ❌ **Cool blue / stark white clinical lighting** — clashes with gold accents
- ❌ **Overly bright / overexposed** — washes out against dark theme

### Video Sourcing

- **Pexels** (free): Search "medical students graduation," "white coat ceremony"
- **Mixkit** (free): Good quality free medical stock
- **Storyblocks** (paid): Best medical footage library
- **Envato Elements** (paid): Premium quality

---

## 10. Full Layout Mock

```
┌──────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░ VIDEO BACKGROUND ░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░ (no overlay, raw) ░░░░░░░░░░░░░░░░░░░░│
│                                                        │
│   ┌──────────────────────────────────────────┐         │
│   │ MedVue    St  Uni  App  Sup   [Get St.]  │  pt-6   │
│   │  gold     ink-muted  → gold on hover     │         │
│   └──────────────────────────────────────────┘         │
│                                                        │
│                                                        │
│                                                        │
│   ┌──────────────────────┬────────────────────┐        │
│   │                      │                    │  pb-12  │
│   │  From application    │          ┌──────┐  │  lg:pb  │
│   │   to white coat.     │          │Admis.│  │  -16    │
│   │   text-canvas        │          │Guid. │  │         │
│   │   letter-spacing:    │          │Excel.│  │         │
│   │   -0.04em            │          │canvas│  │         │
│   │                      │          │glass │  │         │
│   │  We simplify med     │          └──────┘  │         │
│   │  admissions so you   │                    │         │
│   │  can focus...        │                    │         │
│   │  text-ink-muted      │                    │         │
│   │                      │                    │         │
│   │  [Explore Programs]  │                    │         │
│   │  bg-surface text-ink │                    │         │
│   │                      │                    │         │
│   │  [Get Started]       │                    │         │
│   │  glass → hover gold  │                    │         │
│   └──────────────────────┴────────────────────┘         │
└──────────────────────────────────────────────────────┘

  bg: ink (#1A153A)
  gold accents: logo, hovers, glass border gradient
```

---

## 11. Content Comparison Table

### Original (VEX — VC/Branding) → Medical Version

| Element | Original (VEX) | Medical (MedVue) |
|---|---|---|
| **Logo** | VEX (`text-white`) | MedVue (`text-gold`) |
| **Nav links** | Story, Investing, Building, Advisory | Students, Universities, Applications, Support |
| **Nav CTA** | Start a Chat | Get Started |
| **Heading** | Shaping tomorrow / with vision and action. | From application / to white coat. |
| **Subheading** | We back visionaries and craft ventures... | We simplify medical admissions so you can focus on what matters — becoming a doctor. |
| **Button 1** | Start a Chat (`bg-white text-black`) | Explore Programs (`bg-surface text-ink`) |
| **Button 2** | Explore Now (`glass → hover white`) | Get Started (`glass → hover bg-gold text-ink`) |
| **Tag card** | Investing. Building. Advisory. | Admissions. Guidance. Excellence. |
| **Video vibe** | Futuristic/tech | Medical/aspirational (warm-toned) |
| **Color bg** | `#000000` (black) | `#1A153A` (ink) |
| **Primary text** | `#FFFFFF` (white) | `#FAF9F6` (canvas — warm off-white) |
| **Secondary text** | `#D1D5DB` (gray-300) | `#6B6599` (ink-muted) |
| **Accent** | None (monochrome) | `#C4953B` (gold) |

---

## 12. Decision Log

Use this section to track changes as you iterate:

| Date | Decision | Chosen Option | Notes |
|---|---|---|---|
| — | Heading | — | Options A–E in [Section 5.1](#51-heading-left-column) |
| — | Subheading | — | Options 1–4 in [Section 5.2](#52-subheading-left-column) |
| — | Tag card | — | Options A–D in [Section 5.4](#54-tag-card-right-column) |
| — | Video style | — | See [Section 1](#1-video-background) |
| — | Logo name | — | MedVue or alternative |
| — | Nav link order | — | Students, Universities, Applications, Support |
| — | Glass border gradient | Gold-tinted (as spec'd) | Could go full gold if desired |

---

> **Next Steps:**
> 1. **Video** — Upload your footage to Cloudflare R2, replace the URL
> 2. **Tailwind config** — Add the theme colors (see [Section 2](#2-color-theme-design-tokens))
> 3. **Global CSS** — Add `.liquid-glass` + Inter font imports
> 4. **Components** — Build `FadeIn` + `AnimatedHeading`
> 5. **Hero section** — Assemble using the layout in [Section 5](#5-hero-content-bottom-of-viewport)
