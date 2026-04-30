# WebBeatTH

Thai Beat Marketplace MVP สำหรับขายบีทแบบ single-producer store รองรับ public catalog, beat detail, cart, mock checkout, library, admin mock dashboard และ license foundation สำหรับต่อ PDF/email/payment ในเฟสถัดไป

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand
- Supabase/PostgreSQL
- Cloudflare R2 placeholder
- Omise placeholder
- Resend placeholder

## Requirements

- Node.js 20+ แนะนำ
- npm
- Supabase project ถ้าต้องการทดสอบ database/auth จริง

## Install

```powershell
npm install
```

## Environment

คัดลอกไฟล์ตัวอย่างเป็น `.env.local`

```powershell
Copy-Item .env.example .env.local
```

สำหรับ MVP ปัจจุบันสามารถรันหน้า public, cart, checkout และหน้า account/library/orders/admin แบบ fallback ได้แม้ยังไม่ใส่ค่า env จริง โดย middleware จะเริ่ม enforce การ login เมื่อมีการตั้งค่า Supabase/Auth แล้วเท่านั้น

ค่าที่เตรียมไว้ใน `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_BUCKET=
R2_PRIVATE_BUCKET=
R2_PUBLIC_BASE_URL=

OMISE_PUBLIC_KEY=
OMISE_SECRET_KEY=
OMISE_WEBHOOK_SECRET=

RESEND_API_KEY=
EMAIL_FROM=
```

## Run Development

```powershell
npm run dev
```

เปิดเว็บที่:

```text
http://localhost:3000
```

หน้าที่ลองได้ทันที:

- `/` หน้าแรก
- `/beats` browse beats
- `/beats/dark-trap-140-cmin` beat detail
- `/cart` cart
- `/checkout` mock checkout
- `/free` free beat funnel placeholder
- `/login` login placeholder

## Database Setup

ไฟล์ฐานข้อมูลอยู่ใน `database/`

- `database/schema.sql` สำหรับ tables, enums, triggers, RLS policies และ views
- `database/seed.sql` สำหรับ seed data

รายละเอียดโครงสร้างและ RLS — ดู `DatabaseDesign.MD`

วิธีใช้กับ Supabase:

**Dashboard (ครั้งเดียว / ไม่ใช้ CLI)**

1. เข้า Supabase project → SQL Editor  
2. รัน `database/schema.sql`  
3. รัน `database/seed.sql`  
4. สร้าง user ผ่าน Supabase Auth  
5. ตั้ง admin user ด้วยการรัน `database/grant-admin.sql` (แก้อีเมลในไฟล์แล้วรันใน SQL Editor) หรืออัปเดต `profiles.is_admin = true` ด้วยตัวเอง

**CLI (แนะนำสำหรับทีม)** — `supabase/` อยู่ใน repo แล้ว

```powershell
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>
npm run db:sync-schema-migration   # หลังแก้ database/schema.sql
npm run db:push                     # push migrations ขึ้น remote ที่ link แล้ว
```

ถ้า remote DB อยู่ในสภาพค้างบางส่วนและแอปขึ้น `Could not find the table 'public.beats' in the schema cache` ให้รัน:

```powershell
npx supabase db query --linked --agent=no -f database/ensure-marketplace-schema.sql
```

Local stack + seed:

```powershell
npm run db:start
npm run db:reset
```

ดูขั้นตอนครบและเคส repair / โปรเจกต์ว่าง — **`DatabaseDesign.MD` หัวข้อ «ตัวเลือก B — ผ่าน Supabase CLI»**

## Available Scripts

```powershell
npm run dev
```

รัน development server

```powershell
npm run build
```

build production bundle

```powershell
npm run start
```

รัน production server หลัง build

```powershell
npm run lint
```

ตรวจ ESLint

```powershell
npm run typecheck
```

ตรวจ TypeScript แบบไม่ emit ไฟล์

```powershell
npm run db:sync-schema-migration
```

คัดลอก `database/schema.sql` ไปยัง migration เริ่มต้นของ Supabase CLI (`supabase/migrations/20260430120000_initial_schema.sql`)

```powershell
npm run db:start
npm run db:stop
npm run db:reset
npm run db:push
npm run db:link
npm run db:diff
```

Supabase CLI — local stack, seed หลัง reset, push migrations ไป remote, link โปรเจกต์, diff schema (ต้องติดตั้ง Docker สำหรับ `db:start` / `db:reset`)

## Project Structure

```text
src/
  app/                 Next.js App Router routes
  components/          UI, layout, player, beats, cart, checkout, admin
  lib/                 utilities, data access, license terms, integrations และ service wrappers
  stores/              Zustand stores สำหรับ cart/player
  types/               TypeScript shared types

database/              Supabase schema และ seed (แหล่งความจริงของ seed)
supabase/              Supabase CLI — migrations, config.toml (ตัวเลือก B)
scripts/               เช่น sync schema → migration
licenses/              Markdown license templates 4 tier
```

## Current MVP Notes

- Checkout สร้าง order ผ่าน API แล้ว และ fallback เป็น mock เฉพาะตอนยังไม่ตั้งค่า integration env
- License templates ยังเป็น draft ต้องให้ทนายความตรวจสอบก่อนใช้จริง
- PDF generation, Resend email, Omise payment และ R2 signed downloads มี implementation พื้นฐานแล้ว แต่ต้องตั้งค่า env/บัญชีจริงก่อนใช้ production
- Middleware จะ enforce protected routes เมื่อมี Supabase env configured
- OAuth Google: เปิดใช้ provider ใน Supabase และตั้ง redirect URL `{NEXT_PUBLIC_SITE_URL}/auth/callback` (รวม `http://localhost:3000/auth/callback` ตอนพัฒนา)
- R2: ฟอร์ม admin ใช้ `POST /api/admin/r2/presign` แล้ว PUT จากเบราว์เซอร์ — ต้องเป็น admin และตั้งค่า bucket/credentials
- Sentry / GA4: ตั้ง `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` (ถ้าต้องการ client) และ `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Playwright smoke: `npx playwright install chromium` ครั้งแรก จากนั้น `npm run test:e2e`

## Verify Before Commit

```powershell
npm run typecheck
npm run lint
npm run build
```
