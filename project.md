# 🏛️ BJP YAVATMAL — FULL WEBSITE BUILD PROMPT (CURSOR AI)
## Complete, Detailed Specification for a Production-Grade Political Party Website

---

## 🎯 PROJECT OVERVIEW

Build a **complete, multi-page website** for **BJP Yavatmal** (Bharatiya Janata Party — Yavatmal District, Maharashtra). This is a **showcase/portfolio-style political website** — visually stunning, fast, responsive, and smooth. 

**Reference:** https://bjp.org — Match the layout philosophy, navigation structure, full-screen hero image cards, and overall visual feel exactly.

**Tech Stack:**
- **Next.js 14** (App Router)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (ALL animations — page transitions, scroll reveals, stagger effects)
- **GSAP + ScrollTrigger** (for complex scroll-based image card transitions)
- **TypeScript**
- **Shadcn/UI** (for form components, dropdowns)

---

## 📁 PROJECT FOLDER STRUCTURE

Create this exact folder structure:

```
bjp-yavatmal/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-1.jpg          ← Full-screen hero slide 1
│   │   │   ├── hero-2.jpg          ← Full-screen hero slide 2
│   │   │   ├── hero-3.jpg          ← Full-screen hero slide 3
│   │   │   └── hero-4.jpg          ← Full-screen hero slide 4
│   │   ├── sections/
│   │   │   ├── about-bg.jpg        ← About section full-page card
│   │   │   ├── contact-bg.jpg      ← Contact section full-page card
│   │   │   ├── volunteer-bg.jpg    ← Volunteer section full-page card
│   │   │   ├── achievements-bg.jpg ← Achievements section card
│   │   │   └── join-bg.jpg         ← Join section card
│   │   ├── gallery/
│   │   │   ├── gallery-1.jpg
│   │   │   ├── gallery-2.jpg
│   │   │   ├── gallery-3.jpg
│   │   │   ├── gallery-4.jpg
│   │   │   ├── gallery-5.jpg
│   │   │   └── gallery-6.jpg
│   │   ├── leaders/
│   │   │   ├── leader-1.jpg
│   │   │   ├── leader-2.jpg
│   │   │   └── leader-3.jpg
│   │   ├── logos/
│   │   │   ├── bjp-logo.png        ← Official BJP lotus logo (PNG, transparent bg)
│   │   │   └── bjp-logo-white.png  ← White version for dark backgrounds
│   │   └── icons/
│   │       └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout with Navbar + Footer
│   │   ├── page.tsx                ← Home / Landing page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── achievements/
│   │   │   └── page.tsx
│   │   ├── media/
│   │   │   ├── page.tsx            ← Photo & Video gallery
│   │   │   └── resources/
│   │   │       └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── join/
│   │   │   ├── page.tsx            ← Join landing (3 options)
│   │   │   ├── volunteer/
│   │   │   │   └── page.tsx        ← Volunteer form page
│   │   │   ├── member/
│   │   │   │   └── page.tsx        ← Member registration
│   │   │   └── donate/
│   │   │       └── page.tsx        ← Donation page
│   │   ├── login/
│   │   │   └── page.tsx            ← ADMIN ONLY — hidden from nav
│   │   └── admin/
│   │       └── page.tsx            ← Admin dashboard (protected)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── FullPageCardSection.tsx
│   │   │   ├── AchievementsSlider.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── GalleryGrid.tsx
│   │   │   └── JoinSection.tsx
│   │   ├── shared/
│   │   │   ├── SocialBar.tsx
│   │   │   ├── MarqueeStrip.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── AnimatedText.tsx
│   │   │   └── PageTransition.tsx
│   │   └── ui/                     ← Shadcn components go here
│   ├── hooks/
│   │   ├── useScrollReveal.ts
│   │   └── useSlider.ts
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── tailwind.config.ts
├── next.config.js
└── package.json
```

**IMPORTANT — Public Folder Rule:**  
All images go inside `public/images/[category]/`. Always reference as `/images/hero/hero-1.jpg` in Next.js `<Image>` components. The images are placeholders — the client will replace them. Use `next/image` with `fill` and `object-cover` for ALL images. NEVER blur images. Set `quality={90}` on all Next.js Image components.

---

## 🎨 DESIGN SYSTEM & BRAND COLORS

```typescript
// tailwind.config.ts — extend colors
colors: {
  saffron: {
    DEFAULT: '#FF6A00',
    light: '#FF8C00',
    dark: '#E8500A',
  },
  navy: {
    DEFAULT: '#0A1628',
    dark: '#060E1A',
    deeper: '#040A14',
  },
  gold: '#D4A017',
  'india-green': '#138808',
  'india-white': '#F5F0EA',
}
```

**Typography:**
- Display/Headings: `Bebas Neue` (Google Fonts) — ALL CAPS, wide tracking
- Hindi text: `Tiro Devanagari Hindi` (Google Fonts) — for slogans  
- Body: `DM Sans` — clean, modern, readable
- Import all three in `layout.tsx` via `next/font/google`

**Color usage rule:**
- Background: `navy-dark` (#060E1A) and `navy` (#0A1628)
- Accent: Saffron (#FF6A00) for all CTAs, active states, highlights
- Text: White, with `rgba(255,255,255,0.55)` for muted text
- Borders: `rgba(255,255,255,0.08)` default, `rgba(255,106,0,0.3)` on hover

---

## 🧭 NAVIGATION BAR — `Navbar.tsx`

**Behavior:**
- Fixed at top, full-width, `z-index: 1000`
- **Initially fully transparent** — no background, no border
- On scroll past 60px: glass morphism effect — `backdrop-blur-xl`, `bg-navy-dark/80`, bottom border `border-saffron/15`
- Smooth CSS transition: `transition-all duration-500 ease-in-out`

**Left side:** BJP Lotus logo + "BJP Yavatmal" wordmark + "Bharatiya Janata Party" subtitle text

**Center/Right Navigation Links** (with dropdown menus):

```
Home
About BJP ▾
  └── About the Party
  └── Our Leaders
  └── Party History
  └── Ideology & Vision

Our Work ▾
  └── Achievements
  └── Development Projects
  └── Schemes & Programs
  └── Farmer Welfare

Media ▾
  └── Photo Gallery
  └── Video Gallery
  └── Press Releases
  └── News & Updates

Resources ▾
  └── Manifesto
  └── Downloads
  └── Reports
  └── Contact

Join BJP  [BUTTON — saffron bg]  → opens /join page
```

**Dropdown behavior:**
- On hover/click, dropdown slides down with Framer Motion `AnimatePresence`
- Dropdown: `bg-navy-darker/95 backdrop-blur-xl`, `border border-white/8`, rounded corners
- Each item has left saffron line on hover (`border-l-2 border-saffron`)
- Smooth fade + translateY(-8px → 0) animation

**Mobile:**
- Hamburger menu (3 lines → X animated transition)
- Full-screen mobile drawer slides from right
- All nav links + dropdowns accessible

**Hidden login:** NOT in navbar. Only accessible by typing `/login` in URL bar.

---

## 🖼️ SECTION 1 — HERO FULLSCREEN IMAGE SLIDER (Most Important)

**File:** `src/components/home/HeroSlider.tsx`

This is the **exact same style as BJP.org** — fullscreen slides, each slide is a full-page image card.

**Specs:**
- `height: 100vh`, `width: 100vw`
- 4 slides total — each slide = one full-screen image card
- Images from `public/images/hero/hero-1.jpg` through `hero-4.jpg`
- Auto-advance every **5 seconds**
- **NO BLUR on images** — always crisp, full quality

**Each slide contains:**
1. A full-screen `next/image` with `fill`, `object-cover`, `object-position: center top`
2. A dark gradient overlay: `linear-gradient(135deg, rgba(6,14,26,0.75) 0%, rgba(6,14,26,0.2) 60%, transparent 100%)`
3. Text content block (bottom-left aligned):
   - Small badge: `"Yavatmal District · Maharashtra"` with saffron dot
   - Hindi slogan (large, Bebas Neue): e.g. `"एक भारत श्रेष्ठ भारत"`
   - English subtext (Tiro Devanagari Hindi or DM Sans italic)
   - Two CTA buttons: `[Join the Journey]` (saffron) + `[Our Work]` (outline)

**Transitions:**
- Use GSAP for slide transitions — crossfade + subtle Ken Burns zoom on active image
- Active image: `scale(1.0)` | Entering: `scale(1.05)` → animate to `scale(1.0)` over 8s
- Framer Motion `AnimatePresence` for text content swap (fade in from bottom, staggered)

**Slide Dots (right side):**
- Vertical column of dots, far right center
- Active dot: pill shape (taller), saffron color
- Inactive: small circle, `white/30`
- Click to jump to slide
- Smooth Framer Motion layout animation on active dot resize

**Slide Counter (bottom left, above CTA):**
- Shows `01 / 04` format
- Saffron large number, white slash and total

**Social Media Bar (right side, vertically centered):**
- Floating vertical bar with icons: Facebook, X (Twitter), Instagram, YouTube, WhatsApp
- Each icon: 40x40px circle button, `bg-white/8 border border-white/15`
- Hover: `bg-saffron`, scale 1.1
- Links open in new tab

**Bottom gradient:** `linear-gradient(to top, #060E1A 0%, transparent 100%)` — seamless blend into next section

---

## 📌 KEY CONCEPT — FULL-PAGE IMAGE CARD SECTIONS

**This is the core design pattern of the entire site.**

After the hero slider, EVERY major section opens as a **full-screen image card** — like a new "slide" in a presentation. When user scrolls past one section, the next full-page image card "snaps" or smoothly transitions into view.

**Implementation using GSAP ScrollTrigger:**

```javascript
// Each section is pinned momentarily and transitions with a cinematic crossfade
gsap.registerPlugin(ScrollTrigger);

// Pin each full-page section while it's in view
ScrollTrigger.create({
  trigger: ".full-page-section",
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: false,
});
```

Each full-page section:
- `min-height: 100vh`
- Background = full-screen image from `public/images/sections/`
- Dark overlay gradient
- Content centered or left-aligned
- Smooth scroll-triggered reveal for all text elements

**Sections using this pattern:**
1. Hero Slider (4 slides)
2. About Section (1 full-page card)
3. Achievements (section with auto-moving cards, full-width bg)
4. Stats / 3D Card Section (full-page, dark bg)
5. Gallery (full-page, dark bg)
6. Join the Journey (full-page, dark bg)
7. Contact (full-page card)
8. Footer

---

## 📖 SECTION 2 — ABOUT SECTION

**File:** `src/components/home/FullPageCardSection.tsx` (reusable)

Full-screen image card. Image: `public/images/sections/about-bg.jpg`

**Layout (two-column on desktop):**
- Left: Full-height image (60% width) — no blur, full quality
- Right: Content panel (40% width, dark navy bg, padded)
  - `"ABOUT BJP"` section label (saffron, uppercase, spaced)
  - Heading: `"Serving Yavatmal Since Decades"` (Bebas Neue, 4rem+)
  - Body text about BJP Yavatmal's mission, values, history
  - Two stat callouts: e.g. `"16+ Years"` / `"5 Lakh+ Beneficiaries"`
  - CTA button: `"Learn More →"` (saffron outline)

**Animations (Framer Motion + ScrollTrigger):**
- Section fades in on scroll
- Image slides in from left (`x: -60 → 0`)
- Text content slides in from right (`x: 60 → 0`)
- Each text element staggers: label → heading → body → stats → CTA

---

## 🏆 SECTION 3 — ACHIEVEMENTS AUTO-MOVING CARD SLIDER

**File:** `src/components/home/AchievementsSlider.tsx`

**Behavior:**
- Infinite auto-scrolling horizontal card carousel
- Cards move continuously left, looping seamlessly
- **Pauses on hover**
- Uses CSS animation: `@keyframes scrollLeft` + `animation-play-state: paused` on hover

**Each Card (320px wide, 420px tall):**
- Full image at top (200px height) — `next/image`, `object-cover`, NO blur
- Below: date tag (saffron, uppercase), title (Bebas Neue), description (DM Sans)
- Card bg: `bg-white/4 border border-white/8`, border-radius 12px
- Hover: `border-saffron/40`, `translateY(-6px)`, image brightness increases

**Cards to include (create 6+ unique cards):**
1. 500KM Rural Roads (PMGSY)
2. 12,000 PM Awas Houses
3. Jal Jeevan Mission — 80,000 tap connections
4. PM-KISAN — 2 Lakh farmers
5. Ayushman Bharat — 3.5 Lakh families
6. Digital Classrooms — 300 schools

**Section header above slider:**
- `"OUR WORK & ACHIEVEMENTS"` label
- `"What We've Delivered"` in Bebas Neue, with "Delivered" in saffron
- ScrollTrigger reveal animation

---

## 📊 SECTION 4 — 3D STATS / FEATURE SECTION

**File:** `src/components/home/StatsSection.tsx`

Full dark section with two columns:

**Left column:**
- Section heading: `"Our Impact Across Yavatmal District"` (Bebas Neue)
- Paragraph text
- 2x2 grid of animated stat counters:
  - `16+` Years of Service
  - `5L+` Beneficiaries  
  - `₹800Cr` Development Funds
  - `300+` Projects Completed
- Stat numbers animate COUNT UP on scroll into view (use `useCountUp` hook with IntersectionObserver)
- Numbers styled with gradient: `from-saffron to-gold` (`bg-clip-text text-transparent`)

**Right column — 3D Floating Card:**
- CSS `perspective: 1000px` on container
- Card has `transform-style: preserve-3d`
- **Continuous float animation:** `@keyframes float3d` — rotates slightly on Y and X axes, bobs up/down
- **Mouse parallax:** On `mousemove`, card tilts toward cursor (JS `rotateY` and `rotateX` based on mouse position relative to card center)
- Card content: BJP Lotus emoji/SVG (large, glowing), title, description, tag pills
- Card bg: `linear-gradient(135deg, rgba(255,106,0,0.15), rgba(10,22,40,0.9))`, `border border-saffron/25`, `backdrop-blur-xl`
- Box shadow: `0 40px 80px rgba(0,0,0,0.5)` + subtle saffron glow

**ScrollTrigger:** All stat items `staggerChildren: 0.15s`, fade+slide up on scroll

---

## 🖼️ SECTION 5 — PHOTO GALLERY

**File:** `src/components/home/GalleryGrid.tsx`

**Page:** `/media` also has full gallery

**Layout:** Asymmetric CSS Grid (12-column):
```
Col 1–7, Row 1–2  ← Large featured image
Col 8–12, Row 1   ← Medium image
Col 8–12, Row 2   ← Medium image
Col 1–4, Row 3    ← Small image
Col 5–8, Row 3    ← Small image  
Col 9–12, Row 3   ← Small image
```

**Each gallery item:**
- `overflow: hidden`, border-radius 8px
- Image: `next/image` with `fill`, `object-cover` — **NEVER blurred**, always crisp
- Default: `brightness(0.75)`
- Hover: `brightness(0.95)` + `scale(1.06)` transition (600ms ease)
- Hover overlay: `+` icon appears (centered, saffron circle) — Framer Motion `scale(0 → 1)`

**Section header:** Same reveal animation as achievements

---

## 🤝 SECTION 6 — JOIN THE JOURNEY

**File:** `src/components/home/JoinSection.tsx`

**Background:** Radial gradient glows (saffron left, green right) on dark navy

**Heading:** `"Join the Journey"` (huge Bebas Neue, "Journey" in saffron)

**Three cards side by side (flex row, centered):**

### Card 1 — Join as Volunteer
- Icon: 🤝
- Title: "Join as Volunteer"
- Description text
- Button: `"Become a Volunteer"` (saffron bg) → navigates to `/join/volunteer`

### Card 2 — Become a Member  
- Icon: 🏛️
- Title: "Become a Member"
- Description text
- Button: `"Join BJP"` (india-green bg) → navigates to `/join/member`

### Card 3 — Make a Donation
- Icon: 💛
- Title: "Make a Donation"
- Description text
- Button: `"Donate Now"` (gold bg) → navigates to `/join/donate`

**Card design:**
- `bg-white/4 border border-white/8`, border-radius 16px, padding 40px
- Hover: `border-saffron/40 bg-saffron/7 translateY(-8px)` — smooth transition
- Framer Motion `staggerChildren` scroll reveal: cards appear one by one

---

## 📬 SECTION 7 — CONTACT SECTION

**File:** `src/app/contact/page.tsx`

Full-page card with `public/images/sections/contact-bg.jpg` as background.

**Left: Contact Info**
- BJP Yavatmal District Office address
- Phone number, email
- Social media links (large icons)
- Map embed (Google Maps iframe — Yavatmal city)

**Right: Contact Form**
- Fields: Name, Phone, Email, Subject (dropdown), Message
- Shadcn/UI form components
- Saffron focus states on all inputs
- Submit button (saffron)
- Success state: animated checkmark + thank you message

**Framer Motion:** Form slides in from right, info from left on scroll/page load

---

## 🙋 SECTION 8 — JOIN AS VOLUNTEER PAGE

**File:** `src/app/join/volunteer/page.tsx`

Full-page design with `public/images/sections/volunteer-bg.jpg` as background (left half).

**Right panel (form):**
- Heading: `"Join the BJP Seva"` (Bebas Neue)
- Subtext: inspirational quote/text
- Form fields:
  - Full Name
  - Age
  - Gender (radio)
  - Mobile Number (with +91 prefix)
  - Email
  - Village / Ward
  - Tehsil (dropdown — all Yavatmal tehsils)
  - District (pre-filled: Yavatmal)
  - State (pre-filled: Maharashtra)
  - Area of Interest (multi-select: Youth, Farmers, Women, IT, etc.)
  - Message / Why do you want to volunteer?
- Submit button: `"Submit & Join"` (saffron, full-width)
- After submit: success modal with lotus animation

**Important note:** The button in the main nav's "Join BJP" and on the Join section goes to `/join` first. `/join` shows the 3-card selection page. Only after clicking "Volunteer" does it go to `/join/volunteer`.

---

## 🔐 ADMIN LOGIN PAGE — `/login`

**File:** `src/app/login/page.tsx`

**IMPORTANT:** This page is **NEVER linked in navigation**. Only accessible by manually typing `/login` in the browser.

**Design:**
- Full dark page, centered card
- BJP logo at top
- Heading: `"Admin Access"` (Bebas Neue)
- Email + Password fields
- Login button (saffron)
- Subtle caption: "Restricted Access — Authorized Personnel Only"
- On successful login → redirect to `/admin`

---

## 🦶 FOOTER — `Footer.tsx`

**Top strip:** Tricolor bar (India flag colors): saffron | white | green — 4px height

**Main footer:** Dark navy (`#040A14`), 4-column grid:

**Column 1 — Brand:**
- BJP logo + "BJP Yavatmal" + party tagline
- 2–3 line description
- Social media icons (circular, hover saffron)

**Column 2 — Quick Links:**
- Home, About BJP, Our Work, Achievements, Media

**Column 3 — Media:**
- Photo Gallery, Video Gallery, Press Releases, News, Resources

**Column 4 — Contact:**
- District Office address
- Phone / Email
- Grievance Cell link

**Bottom bar:**
- Copyright `© 2024 BJP Yavatmal. All rights reserved.`
- `भारतीय जनता पार्टी – यवतमाळ जिल्हा`
- Privacy Policy | Terms

**Bottom strip:** Tricolor bar again (4px)

---

## ✨ ANIMATIONS SPECIFICATION (GLOBAL)

### Page Transitions
- Use Framer Motion `AnimatePresence` with `mode="wait"` in root layout
- Every page: fade in (`opacity: 0 → 1`) + slide up (`y: 20 → 0`) over 0.4s
- Exit: fade out over 0.2s

### Scroll Reveal (ALL sections)
- Use Framer Motion `whileInView` with `viewport={{ once: true, amount: 0.2 }}`
- Default reveal: `{ opacity: 0, y: 40 }` → `{ opacity: 1, y: 0 }`, duration 0.7s, ease "easeOut"
- Section labels: delay 0s
- Section headings: delay 0.1s
- Body text: delay 0.2s
- Cards/items: stagger 0.12s between each

### Text Animations
- Use character-by-character split animation for hero headings (Framer Motion `motion.span` per character)
- Line-by-line reveal for body paragraphs
- All text animations: smooth, 60fps, no jank

### Hover Micro-interactions
- All buttons: `whileHover={{ scale: 1.02, y: -2 }}` + `whileTap={{ scale: 0.98 }}`
- All cards: `whileHover={{ y: -6, borderColor: "rgba(255,106,0,0.4)" }}`
- Nav links: underline expand animation (CSS `::after` pseudo-element width transition)
- Social icons: scale + background color transition

### Marquee Strip (between hero and about)
- Continuous scrolling text: BJP slogans
- CSS `@keyframes marquee` — no JS needed
- Saffron background, white text, `Bebas Neue` font

---

## ⚡ PERFORMANCE REQUIREMENTS

1. **Images:** Always use `next/image`. NEVER `<img>` tags. All images must have `quality={90}`. Use `priority={true}` on hero images only. No lazy loading for above-fold content.

2. **No blur:** Set `placeholder="empty"` on all `next/image` — no blur-up effect, images load crisp.

3. **Fonts:** Use `next/font/google` with `display: 'swap'` for all fonts.

4. **Animations:** All Framer Motion animations must use `will-change: transform` via `style` prop on animated elements. Use `layout` prop carefully — only where needed.

5. **Code splitting:** Each page section as a separate component. Use `dynamic()` import with `ssr: false` for GSAP-heavy components.

6. **CSS:** Use Tailwind utility classes exclusively. Avoid custom CSS except for:
   - `@keyframes` definitions in `globals.css`
   - The `card-3d` perspective/transform-style rules
   - Scrollbar styling

7. **Lighthouse target:** 90+ on Performance, Accessibility, Best Practices.

---

## 📱 RESPONSIVE BREAKPOINTS (Tailwind)

```
sm: 640px   — Mobile landscape
md: 768px   — Tablet
lg: 1024px  — Desktop
xl: 1280px  — Large desktop
2xl: 1536px — Wide screens
```

**Mobile behavior:**
- Navbar: Logo + hamburger only. Full-screen slide-out drawer.
- Hero: Full-screen, text repositioned to bottom
- Social bar: hidden on mobile
- About cards: stack vertically
- Achievements slider: still scrolls, card width adapts
- 3D card: hidden on mobile (stats remain)
- Gallery: 2-column grid
- Join cards: vertical stack
- Footer: 2-column → 1-column on mobile

---

## 🗺️ COMPLETE SITEMAP

```
/ (Home)
  └── Hero Slider (fullscreen, 4 image slides)
  └── Marquee Strip
  └── About (full-page card)
  └── Achievements (auto-scroll cards)
  └── Stats + 3D Card
  └── Gallery Grid
  └── Join the Journey (3 cards)
  └── Footer

/about
/about/leaders
/achievements
/media (Photo Gallery + Video Gallery)
/media/resources
/contact
/join
/join/volunteer  ← Main volunteer form
/join/member
/join/donate
/login  ← HIDDEN (admin only, not in nav)
/admin  ← Protected dashboard
```

---

## 🧩 COMPONENT CHECKLIST

Build these components in order:

- [ ] `Navbar.tsx` — transparent → blur on scroll, dropdowns, mobile drawer
- [ ] `HeroSlider.tsx` — fullscreen image slider, GSAP/Framer, dots, counter, social bar
- [ ] `MarqueeStrip.tsx` — CSS marquee, saffron bg
- [ ] `FullPageCardSection.tsx` — reusable full-screen section wrapper
- [ ] `AchievementsSlider.tsx` — infinite auto-scroll, pause on hover
- [ ] `StatsSection.tsx` — counter animation, 3D card with parallax
- [ ] `GalleryGrid.tsx` — asymmetric grid, hover effects
- [ ] `JoinSection.tsx` — 3 cards, scroll reveal, CTA buttons
- [ ] `Footer.tsx` — 4 columns, tricolor strips
- [ ] `AnimatedText.tsx` — reusable character/word split animation component
- [ ] `SectionHeader.tsx` — reusable label + title with scroll reveal
- [ ] `PageTransition.tsx` — wraps page content with AnimatePresence
- [ ] Join Volunteer Form page
- [ ] Contact page
- [ ] Login page (hidden)

---

## 📝 FINAL IMPLEMENTATION NOTES

1. **The full-page image card pattern is sacred** — every major section must feel like a "slide" that fills the screen. Use `min-h-screen` on all section wrappers.

2. **NEVER blur images** — use `placeholder="empty"` in all `next/image`. Blurred images ruin the premium feel.

3. **Saffron is the primary accent** — every CTA, active state, hover, underline, dot, tag uses `#FF6A00`.

4. **Login is hidden** — do not add `/login` anywhere in visible navigation. Only accessible via direct URL.

5. **Framer Motion everywhere** — no CSS-only animations for complex reveals. Keep JS animations smooth using `useReducedMotion()` hook to respect user accessibility preferences.

6. **Social media links** in hero are placeholder `href="#"` — client will provide real URLs later.

7. **Volunteer form** at `/join/volunteer` — link this from the "Join BJP" nav button and the Join section volunteer card.

8. **All section image backgrounds** go in `public/images/sections/` — replace placeholder images later.

9. **Tricolor strip** (saffron|white|green, 4px) appears at very top and very bottom of the page.

10. **Start with `pnpm create next-app bjp-yavatmal --typescript --tailwind --app`** then install:
```bash
pnpm add framer-motion gsap @gsap/react
pnpm add class-variance-authority clsx tailwind-merge
pnpm dlx shadcn-ui@latest init
```