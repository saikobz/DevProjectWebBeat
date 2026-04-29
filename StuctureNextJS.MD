# Next.js Project Structure — Beat Marketplace

เอกสารอธิบายโครงสร้างโปรเจกต์ Next.js สำหรับเว็บขายบีท
ใช้เป็น blueprint ตอนเริ่ม build จริง

**Stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Supabase · Zustand · wavesurfer.js · Omise · Cloudflare R2

---

## 1. Folder Tree (เต็ม)

```
เว็บขายบีท/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── .eslintrc.json
├── .env.example                  ← copy เป็น .env.local
├── .env.local                    ← ห้าม commit
├── .gitignore
├── README.md
├── middleware.ts                 ← protect routes
│
├── public/                       ← static assets
│   ├── favicon.ico
│   ├── logo.svg
│   ├── og-image.png
│   └── voice-tags/
│       └── tag-default.mp3       ← voice tag สำหรับ preview
│
├── database/                     ← (มีอยู่แล้ว)
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
│
└── src/
    ├── app/                      ← App Router routes
    │   ├── layout.tsx            ← root layout (nav + persistent player)
    │   ├── page.tsx              ← หน้าแรก /
    │   ├── globals.css           ← Tailwind + custom CSS
    │   ├── error.tsx             ← global error UI
    │   ├── not-found.tsx
    │   ├── loading.tsx           ← loading skeleton
    │   ├── sitemap.ts            ← auto-generated sitemap
    │   ├── robots.ts
    │   │
    │   ├── (public)/             ← route group สำหรับ public pages
    │   │   ├── beats/
    │   │   │   ├── page.tsx              ← /beats — browse + filter
    │   │   │   └── [slug]/
    │   │   │       ├── page.tsx          ← /beats/[slug] — detail
    │   │   │       └── opengraph-image.tsx  ← OG image dynamic
    │   │   ├── cart/
    │   │   │   └── page.tsx              ← /cart
    │   │   ├── checkout/
    │   │   │   ├── page.tsx              ← /checkout
    │   │   │   └── success/page.tsx      ← /checkout/success
    │   │   ├── free/
    │   │   │   └── page.tsx              ← /free — free beats funnel
    │   │   ├── about/page.tsx
    │   │   └── terms/
    │   │       ├── page.tsx              ← Terms of Service
    │   │       ├── privacy/page.tsx      ← Privacy Policy (PDPA)
    │   │       └── license/page.tsx      ← License explanation
    │   │
    │   ├── (auth)/                ← protected routes (login required)
    │   │   ├── library/page.tsx          ← /library — บีทที่ซื้อ
    │   │   ├── orders/
    │   │   │   ├── page.tsx              ← /orders — history
    │   │   │   └── [id]/page.tsx         ← /orders/[id] — detail
    │   │   └── account/page.tsx          ← /account — settings
    │   │
    │   ├── (admin)/               ← admin only
    │   │   └── admin/
    │   │       ├── layout.tsx            ← admin layout + auth check
    │   │       ├── page.tsx              ← /admin — dashboard
    │   │       ├── beats/
    │   │       │   ├── page.tsx          ← list beats
    │   │       │   ├── new/page.tsx      ← upload new beat
    │   │       │   └── [id]/edit/page.tsx
    │   │       ├── orders/page.tsx
    │   │       ├── customers/page.tsx
    │   │       └── analytics/page.tsx
    │   │
    │   ├── login/page.tsx         ← auth page (no group)
    │   ├── register/page.tsx
    │   │
    │   └── api/                   ← API routes
    │       ├── auth/
    │       │   └── callback/route.ts     ← Supabase OAuth callback
    │       ├── beats/
    │       │   ├── route.ts              ← GET /api/beats (filter)
    │       │   └── [id]/play/route.ts    ← POST log play
    │       ├── checkout/
    │       │   ├── route.ts              ← POST create order
    │       │   └── verify/route.ts       ← POST verify payment
    │       ├── downloads/
    │       │   └── [tokenId]/route.ts    ← GET signed URL
    │       ├── webhooks/
    │       │   ├── omise/route.ts        ← Omise payment webhook
    │       │   └── supabase/route.ts
    │       ├── admin/
    │       │   ├── upload/route.ts       ← POST upload beat (multipart)
    │       │   └── stats/route.ts
    │       └── newsletter/
    │           └── route.ts              ← POST subscribe
    │
    ├── components/                ← React components
    │   ├── ui/                    ← primitives (shadcn-style)
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── select.tsx
    │   │   ├── slider.tsx
    │   │   ├── dialog.tsx
    │   │   ├── tabs.tsx
    │   │   ├── badge.tsx
    │   │   ├── card.tsx
    │   │   └── toast.tsx
    │   │
    │   ├── layout/
    │   │   ├── nav.tsx                   ← top navigation
    │   │   ├── footer.tsx
    │   │   └── mobile-menu.tsx
    │   │
    │   ├── player/
    │   │   ├── persistent-player.tsx     ← sticky player ที่อยู่ทุกหน้า
    │   │   ├── waveform-player.tsx       ← wavesurfer wrapper
    │   │   ├── play-button.tsx
    │   │   └── volume-control.tsx
    │   │
    │   ├── beats/
    │   │   ├── beat-card.tsx
    │   │   ├── beat-grid.tsx
    │   │   ├── beat-row.tsx              ← list view
    │   │   ├── filter-bar.tsx
    │   │   ├── search-input.tsx
    │   │   ├── sort-select.tsx
    │   │   └── related-beats.tsx
    │   │
    │   ├── license/
    │   │   ├── license-selector.tsx
    │   │   ├── license-card.tsx
    │   │   └── license-comparison.tsx
    │   │
    │   ├── cart/
    │   │   ├── cart-button.tsx           ← icon + counter
    │   │   ├── cart-drawer.tsx
    │   │   └── cart-item.tsx
    │   │
    │   ├── checkout/
    │   │   ├── checkout-form.tsx
    │   │   ├── payment-method-select.tsx
    │   │   ├── promptpay-qr.tsx
    │   │   └── order-summary.tsx
    │   │
    │   ├── admin/
    │   │   ├── upload-form.tsx
    │   │   ├── stats-card.tsx
    │   │   ├── beat-table.tsx
    │   │   └── order-table.tsx
    │   │
    │   └── providers.tsx          ← all client providers (wraps app)
    │
    ├── lib/                       ← non-React utilities
    │   ├── supabase/
    │   │   ├── client.ts                 ← createBrowserClient
    │   │   ├── server.ts                 ← createServerClient (SSR)
    │   │   ├── service-role.ts           ← server-only admin client
    │   │   └── middleware.ts             ← session refresh
    │   │
    │   ├── r2/
    │   │   ├── client.ts                 ← S3-compatible client
    │   │   ├── signed-url.ts             ← generate signed URL
    │   │   └── upload.ts                 ← upload helpers
    │   │
    │   ├── omise/
    │   │   ├── client.ts
    │   │   ├── create-charge.ts
    │   │   └── verify-webhook.ts
    │   │
    │   ├── audio/
    │   │   ├── ffmpeg.ts                 ← processing wrapper
    │   │   ├── add-tag.ts                ← merge voice tag with beat
    │   │   ├── waveform.ts               ← extract peaks
    │   │   └── convert.ts                ← WAV → MP3
    │   │
    │   ├── email/
    │   │   ├── client.ts                 ← Resend wrapper
    │   │   ├── templates/
    │   │   │   ├── order-confirmation.tsx
    │   │   │   ├── download-ready.tsx
    │   │   │   └── newsletter.tsx
    │   │   └── send.ts
    │   │
    │   ├── pdf/
    │   │   ├── license-pdf.ts            ← generate license PDF
    │   │   └── templates/
    │   │       └── license-template.tsx
    │   │
    │   ├── validation/
    │   │   ├── beat.ts                   ← zod schemas
    │   │   ├── order.ts
    │   │   └── checkout.ts
    │   │
    │   ├── format.ts              ← formatTHB, formatBPM, etc.
    │   ├── slugify.ts
    │   ├── seo.ts                 ← generate meta tags
    │   ├── analytics.ts           ← GA4 + Pixel events
    │   ├── utils.ts               ← cn(), helpers
    │   └── constants.ts           ← LICENSE_TIERS, GENRES, etc.
    │
    ├── stores/                    ← Zustand stores
    │   ├── player-store.ts                ← currentBeat, queue, isPlaying
    │   ├── cart-store.ts                  ← items, persist localStorage
    │   └── ui-store.ts                    ← modals, mobile menu state
    │
    ├── hooks/                     ← custom React hooks
    │   ├── use-supabase-user.ts
    │   ├── use-beats.ts                   ← SWR/fetch wrapper
    │   ├── use-debounce.ts
    │   ├── use-media-query.ts
    │   └── use-toast.ts
    │
    ├── types/                     ← TypeScript types
    │   ├── database.ts                    ← auto-generated from Supabase
    │   ├── beat.ts
    │   ├── order.ts
    │   ├── license.ts
    │   └── index.ts                       ← re-export
    │
    └── styles/                    ← (optional) extra CSS
        └── wavesurfer.css                 ← player styling
```

---

## 2. Route Groups คืออะไร ทำไมต้องใช้

`(public)`, `(auth)`, `(admin)` คือ **Route Groups** ของ Next.js — ใช้จัดกลุ่ม route โดยที่ชื่อโฟลเดอร์ไม่ขึ้นใน URL

ประโยชน์:
- **`(public)`** — ทุกคนเข้าได้ ไม่ต้อง login
- **`(auth)`** — บังคับ login (middleware เช็ค session)
- **`(admin)`** — เฉพาะ user ที่มี `is_admin = true`

URL จริงไม่มีคำว่า `public`/`auth`/`admin` เช่น `app/(auth)/library/page.tsx` → URL คือ `/library`

ทำให้แต่ละกลุ่มมี layout, loading, error UI แยกกันได้

---

## 3. App Router เทียบกับ Pages Router

ใช้ **App Router** เท่านั้น (Next.js 13+) เพราะ:
- Server Components by default — โหลดเร็ว ลด JS bundle
- Streaming + Suspense ในตัว
- Layout แบบ nested
- Route handlers แทน API routes (เร็วกว่า)

Component แบ่งเป็น 2 ประเภท:
- **Server Component** (default) — ไฟล์ไม่มี `'use client'` รันบน server, เข้า DB ตรงได้
- **Client Component** — ไฟล์มี `'use client'` ใช้ hooks, event handlers, browser APIs

**กฎทั่วไปสำหรับโปรเจกต์นี้:**
- หน้า browse, detail = Server Component (ดึงจาก Supabase ตรง)
- Player, Cart, Form = Client Component
- เก็บ Client Component ให้น้อยที่สุดเท่าที่จำเป็น

---

## 4. โครงไฟล์สำคัญที่ต้องเข้าใจ

### `src/app/layout.tsx` (root)
- ใส่ `<html>`, `<body>`, fonts, theme provider
- รวม Nav + Footer + PersistentPlayer
- ครอบทุก page ในเว็บ

### `src/app/page.tsx`
- หน้าแรก `/`
- แสดง featured beats, new releases, free beat CTA, newsletter signup

### `src/app/(public)/beats/page.tsx`
- Server Component ดึงจาก `beats_for_browse` view
- รับ search params (filter, sort, page)
- ส่งให้ `<BeatGrid />` client component

### `src/app/(public)/beats/[slug]/page.tsx`
- Server Component ดึงบีท + license ทั้ง 4 tier
- generateMetadata() สำหรับ SEO + OG tags
- มี `<WaveformPlayer />` + `<LicenseSelector />`

### `src/components/player/persistent-player.tsx`
- **'use client'**
- อยู่ใน root layout — sticky bottom
- subscribe `usePlayerStore()` (Zustand)
- ไม่ unmount เวลาเปลี่ยนหน้า → เพลงไม่หยุด

### `src/stores/player-store.ts`
```typescript
// Pseudo-structure (ไม่ใช่โค้ดจริง)
interface PlayerState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  queue: Beat[];
  volume: number;
  play(beat): void;
  pause(): void;
  next(): void;
  previous(): void;
}
```

### `src/stores/cart-store.ts`
- ใช้ `persist` middleware ของ Zustand → เก็บใน localStorage
- เก็บ `{beatId, licenseId, beatTitle, licenseTier, priceThb}`
- รอด page refresh แต่หายเมื่อ checkout เสร็จ

### `src/middleware.ts`
- รัน Supabase session refresh ทุก request
- redirect `/library`, `/account` ถ้าไม่ได้ login
- redirect `/admin` ถ้าไม่ใช่ admin

---

## 5. Data Flow ตัวอย่าง

### ตัวอย่าง 1: User ฟังบีท
1. คลิก play บน `<BeatCard />` → call `usePlayerStore().play(beat)`
2. `<PersistentPlayer />` (subscribe store) → render audio element + load `beat.preview_url`
3. เริ่มเล่น → `wavesurfer.js` วาด waveform
4. fire `POST /api/beats/[id]/play` → log ไป `beat_plays` table

### ตัวอย่าง 2: User ซื้อบีท
1. คลิก "Buy Now" → call `useCartStore().add(item)` → ไป `/cart`
2. Click checkout → `<CheckoutForm />` → POST `/api/checkout`
3. Server: สร้าง `orders` row (status pending) + call Omise → return charge_url/QR
4. User จ่าย → Omise webhook เข้า `/api/webhooks/omise`
5. Webhook: ตรวจ signature → update order paid → trigger:
   - สร้าง `download_tokens` (signed URL หมดอายุ 48 ชม.)
   - Generate license PDF
   - ส่งอีเมลผ่าน Resend
6. Client poll `/checkout/success` หรือ redirect → แสดง download links

### ตัวอย่าง 3: Admin upload บีทใหม่
1. `/admin/beats/new` → `<UploadForm />` (multipart)
2. POST `/api/admin/upload` กับ WAV + Stems
3. Server: upload ไป R2 private bucket → call `lib/audio/ffmpeg.ts`
4. FFmpeg: convert WAV → MP3, ผสม voice tag, extract waveform peaks
5. Upload preview MP3 ไป R2 public bucket
6. Insert `beats` + `beat_licenses` (4 rows) ลง Supabase
7. Return ไป edit page

---

## 6. Dependencies (จะลงตอน install)

### Core
- `next` ^14.2 — framework
- `react` ^18.3
- `typescript` ^5.6

### Styling
- `tailwindcss` ^3.4
- `clsx` + `tailwind-merge` — สำหรับ `cn()` helper
- `lucide-react` — icons

### Data + State
- `@supabase/ssr` + `@supabase/supabase-js` — DB + Auth
- `zustand` ^4.5 — global state
- `react-hook-form` + `zod` — forms + validation

### Audio
- `wavesurfer.js` ^7 — waveform player

### Server-side (backend libs)
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` — Cloudflare R2 (S3-compatible)
- `omise` — payment SDK
- `resend` — email
- `@react-pdf/renderer` — license PDF generation
- `fluent-ffmpeg` หรือเรียก FFmpeg CLI ผ่าน child_process

---

## 7. Naming Conventions

- **ไฟล์ React component** — kebab-case (`beat-card.tsx`)
- **Component name** — PascalCase (`BeatCard`)
- **Function/variable** — camelCase
- **Constants** — UPPER_SNAKE_CASE
- **Type/Interface** — PascalCase
- **Folder** — kebab-case
- **Route segment** — kebab-case (`/beats/[slug]`)

---

## 8. Environment Variables

แยก 2 ประเภท:

**Public** (prefix `NEXT_PUBLIC_`) — เข้าถึงจาก client ได้
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_OMISE_PUBLIC_KEY`

**Server-only** — ใช้ใน server components และ API routes เท่านั้น
- `SUPABASE_SERVICE_ROLE_KEY`
- `OMISE_SECRET_KEY`
- `OMISE_WEBHOOK_SECRET`
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- `RESEND_API_KEY`

---

## 9. Setup Commands (ตอนเริ่ม build จริง)

```bash
# 1. สร้าง project ด้วย create-next-app
npx create-next-app@latest beat-marketplace \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*"

# 2. install deps
cd beat-marketplace
npm install @supabase/ssr @supabase/supabase-js \
  zustand wavesurfer.js react-hook-form zod \
  lucide-react clsx tailwind-merge \
  @aws-sdk/client-s3 @aws-sdk/s3-request-presigner \
  omise resend @react-pdf/renderer

# 3. shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input select dialog tabs

# 4. setup env
cp .env.example .env.local
# แก้ .env.local ใส่ค่าจริง

# 5. รัน
npm run dev
```

---

## 10. Roadmap การ Build (sprints แนะนำ)

**Sprint 1 — Foundation (3–4 วัน)**
- Setup Next.js, Tailwind, Supabase clients, types
- Root layout, Nav, Footer
- Login/register flow + middleware

**Sprint 2 — Browse + Player (4–5 วัน)**
- Browse page + filter
- Beat detail page
- Persistent player + Zustand
- Wavesurfer integration

**Sprint 3 — Cart + Checkout (5–7 วัน)**
- Cart store + drawer
- Checkout form + Omise integration
- Webhook handler
- Order success page

**Sprint 4 — Delivery (3–4 วัน)**
- R2 signed URL generation
- License PDF generation
- Email templates + Resend
- My Library page

**Sprint 5 — Admin (5–7 วัน)**
- Admin layout + auth
- Upload form + FFmpeg processing
- Beats management
- Sales dashboard

**Sprint 6 — Polish (3–5 วัน)**
- SEO (meta, sitemap, OG images)
- Analytics integration
- Error boundaries
- Bug fix + responsive

---

## 11. ไฟล์ Config ที่สร้างไว้แล้ว

ในเซสชันนี้ผมได้สร้างไฟล์ config base ไว้แล้ว ใช้เป็นจุดเริ่มต้นได้:

- `package.json` — dependencies + scripts
- `tsconfig.json`
- `next.config.mjs` — image domains สำหรับ R2
- `tailwind.config.ts` — brand palette + ink (dark) palette
- `postcss.config.mjs`
- `.eslintrc.json`
- `.env.example` — template ของ environment variables
- `.gitignore`

ถ้าต้องการเริ่มใหม่ทั้งหมดด้วย `create-next-app` ก็ลบไฟล์เหล่านี้ออกก่อนได้

---

## 12. Open Questions ก่อน Build

- ใช้ **shadcn/ui** หรือเขียน UI primitives เอง?
- Theme เริ่มต้นเป็น **dark mode** หรือ light?
- จะใช้ **Vercel** สำหรับ host เลย หรือ self-host?
- Domain name คืออะไร? (ส่งผลต่อ R2 custom domain + email DKIM)
- จะมี **mobile app** ในอนาคตมั้ย? (ส่งผลต่อ API design)

---

*เอกสารนี้เป็น blueprint — ไม่ใช่โค้ดจริง ตอนเริ่ม build ค่อยทำตามโครงนี้ทีละไฟล์*