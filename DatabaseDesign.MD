# Database Schema — Beat Marketplace

โครงสร้างฐานข้อมูล PostgreSQL สำหรับเว็บขายบีท ใช้กับ Supabase

## ไฟล์ในโฟลเดอร์นี้

- `schema.sql` — โครงสร้างตาราง, triggers, RLS policies, views (**แหล่งความจริงสำหรับ schema** เวลาใช้ Dashboard)
- `seed.sql` — ข้อมูลตัวอย่างสำหรับ dev/test (ห้ามใช้ใน production)

โฟลเดอร์ `supabase/` (จาก `supabase init`) ใช้กับ **ตัวเลือก B**:

- `supabase/migrations/20260430120000_initial_schema.sql` — สร้างจาก `database/schema.sql` ผ่าน `npm run db:sync-schema-migration` (อย่าแก้มือใน migration ถ้ายังใช้ workflow นี้)
- `supabase/config.toml` — ตั้ง `db.seed.sql_paths` ให้ชี้ไปที่ `../database/seed.sql` เพื่อไม่ต้องคัดลอก seed ซ้ำ

## วิธีใช้กับ Supabase

### ตัวเลือก A — ผ่าน Supabase Dashboard
1. เข้า Supabase project → SQL Editor
2. Copy เนื้อหา `schema.sql` วางและรัน
3. (ถ้าต้องการ test data) Copy `seed.sql` วางและรัน

### ตัวเลือก B — ผ่าน Supabase CLI (แนะนำสำหรับ team)

โปรเจกต์นี้มีโฟลเดอร์ `supabase/` แล้ว และ migration เริ่มต้นชื่อ `supabase/migrations/20260430120000_initial_schema.sql` (สร้างจาก `database/schema.sql` ผ่านสคริปต์ sync)

#### สิ่งที่ต้องมี

| สิ่งที่ต้องมี | ใช้เมื่อไหร่ |
|--------------|-------------|
| Node.js + `npm install` ใน repo | เสมอ — CLI อยู่ใน `devDependency` |
| `npx supabase ...` หรือ `npm run db:*` | เสมอ — **อย่าพึ่งพา**คำสั่ง `supabase` แบบ global ถ้ายังไม่ได้ติดตั้ง CLI ลง PATH |
| [Docker Desktop](https://docs.docker.com/desktop/) (เปิดให้รันอยู่) | เฉพาะ **`db:start`** / **`db:reset`** (local stack) — **`db push`** / **`migration repair`** ไป remote **ไม่ต้องใช้ Docker** |

#### หา Project Reference (`--project-ref`)

- เปิดโปรเจกต์ใน [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings** → **General** → **Reference ID**
- หรือดูจาก URL: `https://supabase.com/dashboard/project/<REFERENCE_ID>/...`
- **ไม่ใช่** Organization slug (ชื่อ slug ขององค์กรเป็นคนละค่ากับ Reference ID ของโปรเจกต์)

#### ขั้นตอนครั้งแรก (เชื่อม repo กับโปรเจกต์บนคลาวด์)

รันที่รากโปรเจกต์ (`DevProjectWebBeat`):

```bash
npm install
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>
```

CLI จะถามรหัสผ่าน database (ได้จาก Dashboard → **Project Settings** → **Database** → database password) เมื่อจำเป็น

**ตรวจว่า link ถูกโปรเจกต์:** ใน Dashboard โปรเจกต์เดียวกัน เปิด SQL Editor แล้วรัน:

```sql
select tablename from pg_tables where schemaname = 'public' order by tablename;
```

ถ้าได้ 0 แถว = `public` ยังว่าง — ไปขั้นตอน **โปรเจกต์ว่าง** ด้านล่าง

---

#### กรณีที่ 1: Remote ว่างจริง (ยังไม่เคยรัน `schema.sql`)

```bash
npm run db:push
```

ยืนยัน prompt แล้วรอให้ migration แรกรันจบ — จากนั้นควรเห็นตารางใน **Database → Tables** (schema `public`)

ถ้าต้องการข้อมูลตัวอย่างบนคลาวด์ (เฉพาะ env ที่ปลอดภัย):

- เปิด **SQL Editor** แล้วรันเนื้อหา **`database/seed.sql`**  
  (**`db push` ไม่ส่ง seed ขึ้น remote อัตโนมัติ**)

---

#### กรณีที่ 2: Remote เคยมี schema จาก Dashboard แล้ว (รัน `database/schema.sql` ไปแล้ว)

ครั้งแรกที่ `npm run db:push` อาจชน error เช่น `type "beat_genre" already exists` เพราะของอยู่ใน DB แล้ว แต่ประวัติ migration บนคลาวด์ยังไม่บันทึกว่าไฟล์แรกผ่าน — ให้ **baseline** (บอกว่า migration รุ่นนี้ผ่านแล้วโดยไม่รัน SQL ซ้ำ):

```bash
npx supabase migration repair 20260430120000 --status applied --linked --yes
npm run db:push
```

ควรเห็นข้อความประมาณ **`Remote database is up to date.`**

---

#### กรณีที่ 3: `repair --applied` ไปแล้ว แต่จริงๆ DB ว่าง (เห็น 0 tables / query `pg_tables` ได้ 0 แถว)

เกิดได้เมื่อประวัติ migration บอกว่า applied แต่ยังไม่เคยรัน SQL สร้างตารางบนโปรเจกต์นั้น — **`db push` จะขึ้น up to date โดยไม่สร้างอะไร**

แก้โดยย้อนสถานะ migration แรกแล้ว push ใหม่:

```bash
npx supabase migration repair 20260430120000 --status reverted --linked --yes
npm run db:push
```

ถ้ายังชน error เรื่อง type/table มีอยู่แล้ว — ให้ตรวจอีกครั้งว่า **Reference ID** ตรงกับโปรเจกต์ที่เปิดใน Dashboard หรือไม่

ทางเลือกเทียบเท่า: รัน **`database/schema.sql`** ใน SQL Editor ครั้งหนึ่ง แล้วค่อย `migration repair ... --status applied` ให้ประวัติกับความเป็นจริงตรงกัน

---

#### เมื่อแก้ schema ในอนาคต

1. แก้ **`database/schema.sql`** (แหล่งความจริงสำหรับทีมที่ยังใช้ Option A)
2. ถ้าต้องการให้ไฟล์ migration เริ่มต้นตรงกับ schema อีกครั้ง: `npm run db:sync-schema-migration`  
   - **หมายเหตุ:** บน remote ถ้า migration `20260430120000...` **ถูกบันทึกว่า applied แล้ว** CLI **จะไม่รันไฟล์นั้นซ้ำ** — การแก้ schema ถัดไปควรเป็น **migration ใหม่**:
3. สร้าง migration ใหม่:

```bash
npx supabase migration new ชื่อที่อธิบายการเปลี่ยนแปลง
```

แก้ไฟล์ `.sql` ที่สร้างขึ้น (หรือใช้ `npm run db:diff` เมื่อมี local DB) แล้ว:

```bash
npm run db:push
```

เอกสารเพิ่ม: [Supabase CLI — Managing environments & migrations](https://supabase.com/docs/guides/cli/managing-environments)

---

#### Local: Docker + seed อัตโนมัติ

```bash
npm run db:start    # ครั้งแรกดึง image อาจใช้เวลานาน
npm run db:reset    # รัน migrations แล้วรัน database/seed.sql ตาม config.toml
npm run db:stop
```

ถ้าขึ้นว่าเชื่อม Docker ไม่ได้ — เปิด **Docker Desktop** บน Windows ให้รันอยู่ (บางเครื่องต้องรัน terminal แบบ Administrator)

---

#### คำสั่งสรุป (จาก `package.json`)

| คำสั่ง | ความหมาย |
|--------|----------|
| `npm run db:sync-schema-migration` | คัดลอก `database/schema.sql` → `supabase/migrations/20260430120000_initial_schema.sql` |
| `npm run db:link` | `supabase link` (เชื่อมโปรเจกต์) |
| `npm run db:push` | ส่ง migration ที่ยังไม่ apply ขึ้น remote ที่ link ไว้ |
| `npm run db:diff` | เปรียบเทียบ schema (มักใช้กับ local) |
| `npm run db:start` / `db:stop` / `db:reset` | Stack ฐานข้อมูล local (ต้องมี Docker) |

**สรุปสำคัญ:** `seed.sql` **ไม่**ถูก `db push` ขึ้น production — ใช้กับ **`db reset` (local)** หรือรันด้วยมือใน SQL Editor เมื่อต้องการข้อมูลทดสอบบนคลาวด์

---

## Entity Relationship (โครงสร้างแบบรวม)

```
auth.users (Supabase managed)
   ↓ 1:1
profiles
   ↓ 1:N
orders ──────────────→ order_items ──────→ download_tokens
                            ↓
                          beats ←─────→ beat_licenses
                            ↓
                       beat_plays

email_subscribers (standalone)
coupons (standalone)
```

---

## ตารางหลัก

### profiles
ขยาย `auth.users` ของ Supabase เก็บข้อมูลเพิ่ม เช่น display_name, phone, is_admin

### beats
หัวใจของระบบ เก็บข้อมูลบีททั้งหมด รวมถึง path ของไฟล์เสียงใน Cloudflare R2
- `preview_url` → public bucket (มี voice tag)
- `wav_path`, `stems_path` → private bucket (เข้าผ่าน signed URL)
- `waveform_data` → JSON peaks สำหรับ wavesurfer.js
- `tags`, `mood` → array ใช้ GIN index ค้นหาเร็ว

### beat_licenses
แต่ละบีทมีได้สูงสุด 4 license (basic/premium/trackout/exclusive) เก็บราคาแยกแต่ละ tier
`terms` เป็น jsonb เก็บสิทธิ์ใช้งานยืดหยุ่น เช่น stream_limit, monetization, stems_included

### orders + order_items
- `orders` = ใบสั่งซื้อ (1 ใบ = หลายบีท)
- `order_items` = แต่ละบีทใน order
- **สำคัญ:** `order_items` เก็บ snapshot ของราคาและ terms ตอนซื้อ ป้องกันการเปลี่ยนทีหลัง

### download_tokens
เก็บ signed URL ของไฟล์ที่ลูกค้าซื้อ มี:
- `expires_at` — หมดอายุ 48 ชม.
- `max_downloads` — จำกัดจำนวนครั้ง (default 5)
- `download_count` — นับการดาวน์โหลด

### email_subscribers
รายชื่ออีเมลสำหรับ newsletter (separate จาก profiles เพราะคนสมัคร newsletter ไม่จำเป็นต้องเป็น user)

### coupons
ระบบส่วนลด รองรับทั้ง percent และ fixed amount จำกัดจำนวนใช้, ระยะเวลา, และ tier ที่ใช้ได้

### beat_plays
Log การฟัง preview สำหรับ analytics เก็บ session_id แทนตัวตนจริง (PDPA-friendly)

---

## Triggers ที่สำคัญ

| Trigger | ทำอะไร |
|---------|--------|
| `update_updated_at_column` | อัปเดต `updated_at` อัตโนมัติทุกครั้งที่ update row |
| `handle_new_user` | สร้าง `profiles` row อัตโนมัติเมื่อ signup |
| `generate_order_number` | สร้างเลข `ORD-YYYYMMDD-XXXX` |
| `increment_beat_sale_count` | เพิ่ม `sale_count` ใน beats เมื่อ order paid |
| `mark_beat_sold_exclusive` | ถ้ามีคนซื้อ exclusive → เปลี่ยน status บีท + ปิด license อื่น |

---

## Row Level Security (RLS)

เปิดทุกตาราง — กฎหลัก:

| Table | Public | User | Admin |
|-------|--------|------|-------|
| profiles | – | own profile | all |
| beats | published only | published only | all |
| beat_licenses | available only | available only | all |
| orders | – | own orders | all |
| order_items | – | own items | all |
| download_tokens | – | own tokens | all |
| email_subscribers | insert only | – | all |
| coupons | active codes only | – | all |
| beat_plays | insert only | – | read all |

---

## Views

- `beats_for_browse` — บีทที่ published พร้อม min price (ใช้ในหน้า browse)
- `beat_sales_summary` — ยอดขายต่อบีท (admin dashboard)
- `daily_revenue` — รายได้รายวัน (admin dashboard)

---

## ตัวอย่าง Query

### หน้า browse — ดึงบีทพร้อม filter
```sql
select * from beats_for_browse
where bpm between 130 and 150
  and genre = 'trap'
  and 'dark' = any(mood)
order by published_at desc
limit 20;
```

### หน้า detail — ดึงบีทพร้อม license ทุก tier
```sql
select
  b.*,
  json_agg(
    json_build_object(
      'id', bl.id,
      'tier', bl.tier,
      'price_thb', bl.price_thb,
      'terms', bl.terms
    ) order by bl.price_thb
  ) as licenses
from beats b
left join beat_licenses bl on bl.beat_id = b.id and bl.is_available = true
where b.slug = 'dark-trap-140-cmin'
group by b.id;
```

### ลูกค้าดู library ของตัวเอง
```sql
select
  oi.beat_title,
  oi.license_tier,
  o.paid_at,
  oi.license_pdf_path
from order_items oi
join orders o on o.id = oi.order_id
where o.user_id = auth.uid()
  and o.status = 'paid'
order by o.paid_at desc;
```

### Admin — top 10 บีทขายดี
```sql
select * from beat_sales_summary
order by total_revenue_thb desc
limit 10;
```

### Admin — รายได้ 30 วันล่าสุด
```sql
select * from daily_revenue
where day >= current_date - interval '30 days';
```

---

## Migration Strategy

- **แก้ `database/schema.sql`** เป็นหลัก แล้วรัน `npm run db:sync-schema-migration` เพื่ออัปเดตไฟล์ migration เริ่มต้น (`20260430120000_initial_schema.sql`) ให้ตรงกับ Option B
- เมื่อโปรเจกต์โตแล้ว แนะนำแยก migration ใหม่ใน `supabase/migrations/` ต่อท้าย timestamp แทนการแก้ไฟล์ initial ซ้ำ (เช่น `20260515120000_add_wishlist.sql`)

---

## ข้อควรระวัง

1. **อย่าลบ snapshot fields** ใน `order_items` (beat_title, price_thb, license_terms) — เป็น immutable record ที่ต้องมีตลอดไป
2. **license_terms ใช้ jsonb** ไม่ใช่ relation — เปลี่ยน schema ของ terms ในภายหลังได้โดยไม่ต้อง migrate ทั้งตาราง
3. **ใช้ `is_admin = true`** ผ่าน Supabase dashboard ตั้งให้ user ที่เป็นเจ้าของเว็บก่อนเริ่มใช้งาน
4. **download_tokens ต้อง cleanup** ของหมดอายุเป็นระยะ (cron job หรือ scheduled function)
5. **ไฟล์ R2 paths** เก็บแค่ path ไม่ใช่ full URL — generate signed URL ตอน serve เท่านั้น

---

## TODO หลังจาก deploy

- [ ] ตั้ง user คนแรกเป็น `is_admin = true` ผ่าน Supabase SQL editor
- [ ] เซ็ต Supabase Storage policies สำหรับ avatar/cover images
- [ ] สร้าง Edge Function สำหรับ generate signed URL จาก R2
- [ ] สร้าง cron job ลบ download_tokens ที่หมดอายุ
- [ ] Setup Supabase backup (Pro tier)