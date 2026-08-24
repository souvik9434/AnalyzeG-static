# AnalyzeG Static — Premium UI/UX Implementation Plan (Magic UI + Aceternity UI + shadcn/ui)

**Repo:** `D:\AnalyzeG-static` · **Stack:** Astro 4 + React 18 + Tailwind v3.4 + framer-motion 13 + TypeScript
**Goal:** Industry-grade, trustworthy B2B + B2C landing page (Vercel/Linear aesthetic — premium, NOT gamer-flashy)
**For:** Implementation engineers. Every change below is copy-paste exact. Do NOT improvise.

---

## PART 0 — MEMORANDUM: EDITS ALREADY APPLIED (DO NOT REDO / DO NOT REVERT)

These changes already exist in the working tree. Verify with `git diff` before touching anything.

### Already COMMITTED & PUSHED to `main` (live after Cloudflare build)
| # | File | Change |
|---|------|--------|
| C1 | `package.json` | React 19 → **18.3.1** (fixes Cloudflare ERESOLVE); added `"dev": "astro dev"`, `"build": "astro build"`, `"preview": "astro preview"` scripts |
| C2 | `src/layouts/BaseLayout.astro` | Added `import '../styles/globals.css';` — **this is what makes Tailwind work.** Never remove. |
| C3 | `public/js/scripts.js` | Removed legacy `initializeAudienceToggle()` + `setActiveAudience()` (~216 lines). Audience state is owned by React `AudienceSwitch` ONLY. |
| C4 | `src/components/AudienceSwitch.tsx` | Reads/writes `localStorage.selectedAudience` on mount; syncs DOM `[data-audience]` sections. |

### Applied in WORKING TREE (uncommitted — commit as one batch: `feat: premium polish pass 1`)
| # | File | Location | Change |
|---|------|----------|--------|
| W1 | `public/css/styles.css` | `.hero-overlay` (~line 519) | Replaced flat gradient with layered scrim: radial vignette + 3-stop linear `rgba(10,14,30,…)`; added `text-shadow` rules for `.hero-content h1`, `.hero-title`, `.hero-tagline` |
| W2 | `public/css/styles.css` | after `.feature-item:hover` (~line 570) | NEW `.feature-item svg { width:48px; height:48px; … }` + hover scale + 768px media query (40px). Fixes giant unsize SVG icons. |
| W3 | `public/css/styles.css` | `.feature-item img` 768px media query | Mobile icon 140px → **64px** |
| W4 | `public/css/styles.css` | `.btn-secondary` | Border `2px solid rgba(255,255,255,0.2)` → `1px solid rgba(255,255,255,0.35)` |
| W5 | `public/css/styles.css` | after `.cta { … }` (~line 1861) | NEW base rule `.cta-buttons { display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:1rem; margin-top:2rem; }` — fixes flush/stacked buttons |
| W6 | `public/css/styles.css` | `.step-content ul` / `ul li` | Added `text-align:left`; `padding-left:28px`; NEW `li::before` mask-image blue checkmark bullet |

---

## PART 1 — CRITICAL BUG FIXES (apply FIRST, before any premium upgrades)

---

### FIX-1 · B2B scroll animations are DEAD after toggle (REGRESSION — highest priority)

**Root cause:** The legacy `setActiveAudience()` used to call `AOS.refreshHard()` after toggling sections. It was deleted in C3. AOS elements (`data-aos`) inside `display:none` sections never get registered, so when the Brand section is shown, its animations never fire and elements can stay invisible.

**File:** `src/components/AudienceSwitch.tsx`
**Section:** the `syncAudienceSections` helper function (top of file)
**Replace the entire function with:**

```tsx
function syncAudienceSections(audience: string) {
  const reviewerSections = document.querySelectorAll('[data-audience="reviewer"]');
  const brandSections = document.querySelectorAll('[data-audience="brand"]');

  if (audience === "reviewer") {
    reviewerSections.forEach((el) => el.classList.add("active"));
    brandSections.forEach((el) => el.classList.remove("active"));
  } else {
    reviewerSections.forEach((el) => el.classList.remove("active"));
    brandSections.forEach((el) => el.classList.add("active"));
  }

  // CRITICAL: AOS elements inside display:none sections are never registered.
  // Refresh AOS after the newly-shown section is laid out so data-aos
  // animations fire for the Brand timeline/pricing/CTA.
  setTimeout(() => {
    if (typeof (window as any).AOS !== "undefined") {
      (window as any).AOS.refreshHard();
    }
  }, 100);
}
```

**Acceptance:** Toggle to "For Brands" → scroll → B2B timeline cards fade-up correctly.

---

### FIX-2 · Timeline beam flush against left viewport edge (mobile) + node alignment

**File:** `src/components/AnimatedTimeline.tsx`
**4 exact string replacements (2 in the fallback return, 2 in `TracingBeamCore`):**

| Find (all occurrences) | Replace with |
|---|---|
| `absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200/50` | `absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200/50` |
| `pl-12 md:pl-20` (fallback wrapper) | `pl-14 md:pl-20` |
| `absolute left-4 md:left-8 top-3 flex flex-col items-center` | `absolute left-6 md:left-8 top-2 flex flex-col items-center` |
| `pl-12 md:pl-20 relative z-10` | `pl-14 md:pl-20 relative z-10` |

Node alignment: dot moves `top-3` → `top-2` so the dot center locks to the first card's visual top edge (dot is 16px; svg `-mt-4` overlap stays as-is).

**Acceptance:** On 375px viewport, the vertical line has ≥24px clearance from screen edge; dot aligns with first card top.

---

### FIX-3 · Hidden B2B timeline beam measures height 0 (beam never draws)

**Root cause:** `svgHeight` is measured with `ResizeObserver`, but a `display:none` subtree reports `offsetHeight === 0`. When the Brand section becomes visible the beam can stay collapsed.

**File:** `src/components/AnimatedTimeline.tsx`
**Section:** `TracingBeamCore` — the first `useEffect` (the one creating `resizeObserver`)
**Replace the entire `useEffect` with:**

```tsx
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => updateHeight());
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // Re-measure when the section becomes visible. The audience toggle uses
    // display:none, which reports height 0 and collapses the beam for the
    // hidden timeline until this observer fires.
    const visibilityObserver = new IntersectionObserver(() => updateHeight());
    if (ref.current) {
      visibilityObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);
```

---

### FIX-4 · "For Brands" hero tagline is a wall of text

**File:** `src/pages/index.astro`
**Find (inside `#brand-content` → `.hero-content`):**

```html
<p class="hero-tagline">
    30-second in-hand product videos • State &amp; age filtering • Power BI dashboard • Raw data included • Licensed for advertising (main brands) • Delivered in 2min-24hrs
</p>
```

**Replace with:**

```html
<ul class="hero-tagline-list" data-aos="fade-up">
    <li>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        30-second in-hand product videos
    </li>
    <li>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        State &amp; age filtering
    </li>
    <li>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Power BI dashboard + raw data included
    </li>
    <li>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Licensed for advertising (main brands)
    </li>
    <li>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Delivered in 2 min – 24 hrs
    </li>
</ul>
```

**Then add to `public/css/styles.css` (append near the `.hero-tagline` rule):**

```css
/* B2B hero value props: scannable checklist, not a paragraph wall */
.hero-tagline-list {
  list-style: none;
  margin: 1.25rem auto 0;
  padding: 0;
  max-width: 460px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.hero-tagline-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
}

.hero-tagline-list li svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 0.2em;
  color: #4ade80; /* green check = trust signal */
}

@media (max-width: 640px) {
  .hero-tagline-list {
    max-width: 100%;
  }
  .hero-tagline-list li {
    font-size: 0.95rem;
  }
}
```

---

### FIX-5 · ₹ glyph rendering (low risk, do last of Part 1)

The pricing `₹` lives in Poppins text (index.astro lines ~777–816). Poppins **does** contain ₹; distortion happens only while the async font swaps or on devices without Poppins coverage. Apply this safety net:

**Append to `public/css/styles.css`:**

```css
/* Rupee glyph: guarantee a font stack with full ₹ coverage during font swap */
[schema-pricing] span,
.b2b-pricing-section span[style*="2.5rem"] {
  font-family: "Poppins", "Segoe UI", "Noto Sans", system-ui, sans-serif;
}
```

Do NOT replace ₹ with images. If a device still shows a broken glyph, revisit with an inline SVG rupee — but only with screenshot proof.

---

## PART 2 — PREMIUM UPGRADES (Magic UI + Aceternity + shadcn)

### Research verdict (which library, where)

| Library | Verdict for this project |
|---|---|
| **Magic UI** | Best fit. shadcn-registry install (`npx shadcn@latest add @magicui/<name>`), Tailwind v3-safe, light JS. Use for: Marquee, NumberTicker, Animated Grid Pattern, Text Animate. |
| **Aceternity UI** | Use selectively. Registry code now imports `motion/react` and shows Tailwind **v4** CSS — must use each page's **"Tailwind CSS v3" tab** and swap imports to `framer-motion`. Use for: Hover Border Gradient (pricing), Background Beams (final CTA). |
| **shadcn/ui** | Foundation already installed (`components.json`, `src/lib/utils.ts`). Use Accordion for FAQ. |

**Global dependency rule:** we already have `framer-motion`, `clsx`, `tailwind-merge`, `lucide-react`. If any pasted component imports from `"motion/react"`, **replace that import with `"framer-motion"`** — APIs are identical. Do NOT install the `motion` package.

---

### SETUP-1 · One-time Tailwind config additions (required by Marquee + any Aceternity pieces)

**File:** `tailwind.config.mjs`
**Replace the whole file with:**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
```

---

### UPG-1 · Trust Marquee bar (new section, directly under hero)

Social-proof density: an infinite scrolling strip of platform capability chips. Professional pause-on-hover.

**1. Install (terminal):**
```bash
npx shadcn@latest add @magicui/marquee
```
→ creates `src/components/ui/marquee.tsx`.

**2. Create `src/components/TrustMarquee.tsx`:**

```tsx
import React from "react";
import { Marquee } from "@/components/ui/marquee";

const chips = [
  "100% Verified Reviewers",
  "30-Second In-Hand Videos",
  "Power BI Dashboards",
  "State + Age Filtering",
  "Raw Data Export (CSV/Excel)",
  "50% Revenue Share",
  "Ad-Licensing for Brands",
  "2-Minute Delivery",
];

const Chip = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
    {label}
  </div>
);

export function TrustMarquee() {
  return (
    <div className="relative w-full overflow-hidden border-y border-slate-200/60 bg-slate-50/80 py-4">
      <Marquee pauseOnHover className="[--duration:25s]">
        {chips.map((c) => (
          <Chip key={c} label={c} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent" />
    </div>
  );
}
```

**3. Mount in `src/pages/index.astro`:**
- Add to frontmatter imports:
```astro
import { TrustMarquee } from '../components/TrustMarquee';
```
- Directly AFTER the closing `</section>` of the hero section (right before the `<!-- How It Works Section -->` comment), insert:
```astro
<TrustMarquee client:load />
```

---

### UPG-2 · Animated stat counters (new stats row inside the Trust section)

**1. Install:**
```bash
npx shadcn@latest add @magicui/number-ticker
```
→ creates `src/components/ui/number-ticker.tsx`.

**2. Create `src/components/StatsRow.tsx`:**

```tsx
import React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { value: 100, suffix: "%", label: "Verified reviewers" },
  { value: 30, suffix: "s", label: "In-hand product videos" },
  { value: 50, suffix: "%", label: "Revenue share payout" },
  { value: 24, suffix: "h", label: "Max delivery window" },
];

export function StatsRow() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 py-12 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center text-center">
          <div className="text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
            <NumberTicker value={s.value} className="text-slate-900" />
            <span className="text-blue-600">{s.suffix}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
```

**3. Mount in `index.astro`** inside the `<section class="features-preview">` container, immediately AFTER the `<h2 class="section-title">Why Choose AnalyzeG?</h2>` line:
```astro
<StatsRow client:visible />
```

---

### UPG-3 · Feature grid → Aceternity Card Hover Effect (Stripe-style highlight)

**1. Install (manual copy is safer in Astro):** open https://ui.aceternity.com/components/card-hover-effect — copy the component code into `src/components/ui/card-hover-effect.tsx`. If code imports `motion/react` → change to `framer-motion`. (CLI alternative: `npx shadcn@latest add @aceternity/card-hover-effect`.)

**2. Create `src/components/FeatureHoverGrid.tsx`:**

```tsx
import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const items = [
  {
    title: "Secure Verification System",
    description: "Every review is digitally authenticated and securely recorded for maximum trust.",
    link: "/features.html",
  },
  {
    title: "Dual-Stage Payout",
    description: "Up to Rs 40 after verification, plus the remaining payout from your 50% share when sold.",
    link: "/earn-money-reviews.html",
  },
  {
    title: "AI-Powered Analytics",
    description: "Sentiment analysis, key themes and trend detection from real product videos.",
    link: "/features.html",
  },
];

export function FeatureHoverGrid() {
  return <HoverEffect items={items} className="md:grid-cols-3" />;
}
```

**3. Mount in `index.astro`:** inside `.features-preview .container`, REPLACE the entire `<div class="feature-grid"> … </div>` block (the three `.feature-item` divs) with:
```astro
<FeatureHoverGrid client:visible />
```
⚠️ Keep the `<h2>` section title. Do NOT delete `.feature-item` CSS yet (other pages still use it).

---

### UPG-4 · Pricing "MOST POPULAR" card → Aceternity Hover Border Gradient

**1. Get code:** https://ui.aceternity.com/components/hover-border-gradient → paste to `src/components/ui/hover-border-gradient.tsx` (no framer-motion needed — pure CSS; Tailwind v3-safe).

**2. Use it in `index.astro`** — the pricing cards are plain HTML with inline styles. Wrap ONLY the primary CTA of the "500 Reviews" card. Find:
```html
<p style="font-style: italic; color: #64748b; margin-top: 1.5rem; font-size: 0.9rem;">Ideal for: Product launches, market research</p>
```
and insert directly BEFORE it:
```html
<a href="https://analyzeg.netlify.app/b2b-auth" data-app-href="/b2b-auth" rel="noopener"
   class="btn-primary" style="width:100%; display:flex; justify-content:center; margin-top:1.5rem;">
   Get 500 Reviews
</a>
```
(If the team prefers the full rotating-border card treatment, that is a Phase-2 item — requires porting the pricing cards into a React component. Do not attempt in this pass.)

---

### UPG-5 · FAQ → shadcn Accordion (replaces custom FAQ JS)

**1. Install:**
```bash
npm i @radix-ui/react-accordion
```

**2. Create `src/components/ui/accordion.tsx` manually (CLI may emit Tailwind-v4-flavored code — use this exact file):**

```tsx
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-left font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```

**3. Add accordion keyframes — in `tailwind.config.mjs` (from SETUP-1), also add:**
```js
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-down 0.2s ease-out',
```
inside `animation: { … }`, and:
```js
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
```
inside `keyframes: { … }`.

**4. Create `src/components/FaqAccordion.tsx`** — port the Q&A pairs from `src/pages/analyzeg-faq.astro` (the same text already exists in that file's JSON-LD `mainEntity`). Pattern:
```tsx
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>How much can I earn per review?</AccordionTrigger>
        <AccordionContent>
          You can get up to Rs 40 after verification. The remaining payout is
          processed when your review is sold, based on your 50% share.
        </AccordionContent>
      </AccordionItem>
      {/* …port remaining items from analyzeg-faq.astro JSON-LD… */}
    </Accordion>
  );
}
```
Mount on the FAQ page with `client:visible`. Keep the existing vanilla FAQ on the page until this is verified, then remove the old `.faq-item` markup + its handler block in `scripts.js` (lines with `faqQuestions`).

---

### UPG-6 · Final CTA background → Aceternity Background Beams (dimmed)

**Phase-2 (deferred):** requires porting the `.cta` section into React. The current CSS gradient CTA is already professional. Do NOT attempt in this pass unless explicitly assigned.

---

### Explicitly REJECTED for this brand (do not add, ever)
Meteors, Sparkles, Rainbow Button, Retro Grid, Vortex, Globe (heavy), Confetti, Smooth Cursor. These read as consumer/gamer and destroy B2B credibility.

---

## PART 3 — EXECUTION ORDER & VERIFICATION

**Order (strict):**
1. FIX-1 → 2. FIX-2 → 3. FIX-3 → 4. FIX-4 → 5. FIX-5 → commit `fix: audience toggle AOS refresh + timeline + hero readability batch`
6. SETUP-1 → 7. UPG-1 → 8. UPG-2 → 9. UPG-3 → 10. UPG-4 → commit `feat: premium components pass (marquee, ticker, hover grid)`
11. UPG-5 only after 1–10 verified.

**Verification after EVERY step (all mandatory):**
```bash
npx astro build        # must complete with 0 errors
npm run preview        # then check:
```
- [ ] Desktop 1366px: hero text readable over background; no overlap
- [ ] Mobile 375px: timeline line ≥24px from edge; no horizontal scroll
- [ ] Toggle B2C→B2B→B2C: content switches, AOS animations fire BOTH ways
- [ ] B2B timeline beam draws while scrolling (both toggles)
- [ ] CTA buttons have visible gap on mobile
- [ ] Feature icons ≤48px; lists left-aligned
- [ ] `prefers-reduced-motion`: marquee/ticker static or hidden
- [ ] No console errors (except known site.webmanifest 404)

**Never touch:** `BaseLayout.astro` globals import (C2), `data-audience` contract, `localStorage.selectedAudience` key, `scripts.js` mobile-menu/FAQ/smooth-scroll blocks, `astro.config.mjs` (`applyBaseStyles: false` stays).
