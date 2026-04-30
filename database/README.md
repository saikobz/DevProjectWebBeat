# Database

Supabase/PostgreSQL schema สำหรับ Beat Marketplace MVP

## Files

- `schema.sql` - tables, enums, triggers, RLS policies และ views หลัก
- `seed.sql` - ข้อมูลตัวอย่างสำหรับ development
- `grant-admin.sql` - ตั้ง `profiles.is_admin = true` ให้บัญชีที่มีอยู่แล้วใน Supabase Auth
- `ensure-profiles.sql` - ซ่อมกรณีรัน schema ไม่ครบ (เช่น enum มีแล้วแต่ยังไม่มี `profiles`)
- `ensure-marketplace-schema.sql` - ซ่อมกรณี schema ค้างบางส่วน (เช่นมี `profiles` แล้ว แต่ยังไม่มี `beats`/ตาราง marketplace อื่น)

## Usage

ลำดับที่ถูกต้อง (โปรเจกต์ใหม่):

1. รัน **`schema.sql`** ใน Supabase SQL Editor — ถ้าข้ามข้อนี้ `grant-admin.sql` จะ error ว่าไม่มี `public.profiles`
2. (ทางเลือก) รัน **`seed.sql`** เพื่อข้อมูลตัวอย่าง
3. สร้าง user ใน Authentication แล้วแก้อีเมลใน **`grant-admin.sql`** แล้วรันเพื่อตั้ง `is_admin` และเข้า `/admin`

**ถ้า `schema.sql` error ว่า type มีอยู่แล้ว แต่ `grant-admin` บอกไม่มี `profiles`:** รัน **`ensure-profiles.sql`** แล้วค่อยรัน `grant-admin.sql` อีกครั้ง (อย่ารัน `schema.sql` ซ้ำทั้งไฟล์)

**ถ้าแอปขึ้น `Could not find the table 'public.beats' in the schema cache`:** remote DB ยังไม่มี `public.beats` จริง ให้รัน **`ensure-marketplace-schema.sql`** แล้วค่อย refresh หน้าเว็บ
