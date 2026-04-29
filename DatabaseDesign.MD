# Database Schema — Beat Marketplace

โครงสร้างฐานข้อมูล PostgreSQL สำหรับเว็บขายบีท ใช้กับ Supabase

## ไฟล์ในโฟลเดอร์นี้

- `schema.sql` — โครงสร้างตาราง, triggers, RLS policies, views
- `seed.sql` — ข้อมูลตัวอย่างสำหรับ dev/test (ห้ามใช้ใน production)

## วิธีใช้กับ Supabase

### ตัวเลือก A — ผ่าน Supabase Dashboard
1. เข้า Supabase project → SQL Editor
2. Copy เนื้อหา `schema.sql` วางและรัน
3. (ถ้าต้องการ test data) Copy `seed.sql` วางและรัน

### ตัวเลือก B — ผ่าน Supabase CLI (แนะนำสำหรับ team)
```bash
# ติดตั้ง CLI
npm install -g supabase

# Init project
supabase init

# วาง schema.sql ใน supabase/migrations/0001_initial_schema.sql
# วาง seed.sql  ใน supabase/seed.sql

# Push to remote
supabase db push
```

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

ระยะแรกสามารถใช้ schema.sql ทั้งไฟล์เดียวก่อน เมื่อโตขึ้นค่อยแยกเป็น migrations:

```
supabase/migrations/
  0001_initial_schema.sql       ← ส่วนของไฟล์นี้
  0002_add_wishlist.sql
  0003_add_subscription_tier.sql
  ...
```

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