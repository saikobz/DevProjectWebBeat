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

สำหรับ MVP ปัจจุบันสามารถรันหน้า public/cart/mock checkout ได้แม้ยังไม่ใส่ค่า env จริง แต่ route ที่ protected ด้วย middleware เช่น `/library`, `/orders`, `/account`, `/admin` จะ redirect ไป `/login` ถ้ายังไม่ได้ตั้งค่า Supabase/Auth

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

วิธีใช้กับ Supabase:

1. เข้า Supabase project
2. เปิด SQL Editor
3. รัน `database/schema.sql`
4. รัน `database/seed.sql`
5. สร้าง user ผ่าน Supabase Auth
6. ตั้ง admin user ด้วยการอัปเดต `profiles.is_admin = true`

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

## Project Structure

```text
src/
  app/                 Next.js App Router routes
  components/          UI, layout, player, beats, cart, checkout, admin
  lib/                 utilities, mock data, license terms/placeholders, service wrappers
  stores/              Zustand stores และ mock order localStorage
  types/               TypeScript shared types

database/              Supabase schema และ seed
licenses/              Markdown license templates 4 tier
```

## Current MVP Notes

- Checkout ตอนนี้เป็น mock payment และบันทึก order ใน `localStorage`
- License templates ยังเป็น draft ต้องให้ทนายความตรวจสอบก่อนใช้จริง
- PDF generation, Resend email, Omise payment และ R2 signed downloads เป็น placeholder สำหรับเฟสถัดไป
- Middleware จะ enforce protected routes เมื่อมี Supabase env configured

## Verify Before Commit

```powershell
npm run typecheck
npm run lint
npm run build
```
