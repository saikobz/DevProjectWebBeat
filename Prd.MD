# PRD & Roadmap — เว็บขายบีท (Thai Beat Marketplace)

**Version:** 1.0
**Last updated:** 2026-04-29
**Owner:** Padon

---

## 1. Executive Summary

โปรเจกต์นี้คือเว็บไซต์ขายบีท (instrumental beats) สำหรับตลาดไทย เน้นแนว Hip-hop, Trap, R&B และ Drill ลูกค้าหลักคือแร็ปเปอร์และนักทำเพลงในประเทศไทย โมเดลเป็น marketplace ของโปรดิวเซอร์เจ้าของเว็บเอง (single-producer store) โดยใช้โครงสร้าง license หลายระดับ (Lease + Exclusive) ที่เป็นมาตรฐานของอุตสาหกรรม ปรับให้เหมาะกับกำลังซื้อของตลาดไทย

จุดต่างจาก BeatStars/Airbit:
- ภาษาไทยทั้งเว็บ
- รองรับ PromptPay ในตัว (ไม่ต้องบัตรเครดิต)
- ราคาและสัญญาเขียนเป็นภาษาไทย เข้าใจง่าย
- เน้นบีทแนวที่ตลาดไทยฟัง

---

## 2. Vision & Goals

### Vision
เป็นแหล่งซื้อบีทออนไลน์ที่แร็ปเปอร์ไทยนึกถึงเป็นที่แรก ด้วยประสบการณ์ใช้งานที่ดี ราคาเข้าถึงได้ และขั้นตอนการชำระเงินที่ตรงกับพฤติกรรมคนไทย

### Goals (12 เดือนแรก)
- **เดือน 1–3:** เปิดตัวเว็บ + อัปโหลดบีท 30+ ตัว
- **เดือน 4–6:** ยอดขาย 10–20 ออเดอร์/เดือน, รายได้ 5,000–15,000 บาท/เดือน
- **เดือน 7–12:** ยอดขาย 30+ ออเดอร์/เดือน, รายได้ 30,000+ บาท/เดือน, traffic 3,000+ unique visitors/เดือน

### Non-Goals (สิ่งที่ "ไม่ทำ" ในเฟสแรก)
- ไม่เปิดให้โปรดิวเซอร์รายอื่นมาขาย (single-store ก่อน)
- ไม่รองรับภาษาอังกฤษหรือสกุลเงินอื่น
- ไม่ทำ mobile app (เน้น mobile-responsive web ก่อน)
- ไม่มีระบบ subscription/membership ในเฟสแรก

---

## 3. Target Users (Personas)

### Persona 1 — "อิ๊งค์" แร็ปเปอร์อิสระ
- อายุ 18–25 ปี กรุงเทพ/ปริมณฑล
- มี YouTube/TikTok ไม่กี่พัน follower
- งบซื้อบีทต่อเพลง 300–1,500 บาท
- ใช้ PromptPay เป็นหลัก ไม่มีบัตรเครดิต
- ฟัง preview จากมือถือ ตัดสินใจเร็ว
- **ต้องการ:** บีทคุณภาพ ราคาจับต้องได้ ดาวน์โหลดทันทีหลังจ่าย

### Persona 2 — "เบียร์" Bedroom Producer / นักทำเพลง
- อายุ 22–32 ปี ทำเพลงอิสระ
- ซื้อ stems ไปมิกซ์เองเพื่อทำ remix หรือใช้ในงาน
- งบสูงกว่า อยู่ที่ 1,500–3,000 บาทต่อบีท
- **ต้องการ:** Trackout/Stems คุณภาพสูง สัญญาชัดเจน

### Persona 3 — "มิ้นท์" คอนเทนต์ครีเอเตอร์
- ทำคลิป TikTok/Reels/YouTube Shorts
- ต้องการเพลงประกอบที่ไม่โดน copyright strike
- งบ 300–800 บาท ซื้อแบบ basic lease
- **ต้องการ:** ใช้งานง่าย เครดิตชัด ไม่ยุ่งยาก

---

## 4. Business Model & License Structure

### License Tiers

| Tier | ชื่อ | ราคาเริ่มต้น | ไฟล์ที่ได้ | สิทธิ์ใช้งาน |
|------|------|------------|-----------|------------|
| 1 | Basic Lease (MP3) | 299–499 บาท | MP3 (untagged) | สตรีม/ขายไม่เกิน 5,000 ครั้ง, ต้องเครดิต |
| 2 | Premium Lease (WAV) | 799–1,499 บาท | WAV + MP3 | สตรีม/ขายไม่เกิน 50,000 ครั้ง, ทำ MV ได้, monetize ได้ |
| 3 | Trackout / Stems | 1,999–2,999 บาท | WAV + Stems + MP3 | สตรีม/ขายไม่เกิน 100,000 ครั้ง, มิกซ์เองได้ |
| 4 | Exclusive | 5,000–30,000 บาท | ครบทุกไฟล์ + ลบจากเว็บ | สิทธิ์เต็ม, โปรดิวเซอร์ยังมีเครดิต |

### กฎสำคัญทุก Tier (ยกเว้น Exclusive)
- ห้ามขายต่อหรือ re-license ให้บุคคลที่สาม
- ต้องระบุ "Prod. by [ชื่อโปรดิวเซอร์]" ในชื่อเพลง/คำบรรยาย
- ห้ามใช้กับเนื้อหาผิดกฎหมายหรือแนวเกลียดชัง
- License เริ่มผลทันทีที่ชำระเงินเสร็จ

### Revenue Model
- **Lease (Tier 1–3)**: ขายซ้ำให้ลูกค้าได้หลายคน — รายได้ recurring ต่อบีท
- **Exclusive (Tier 4)**: ขายครั้งเดียว ลบจากเว็บ — รายได้ก้อนใหญ่
- **Free Beat**: บีทบางตัวให้ดาวน์โหลดฟรี (มี tag) เพื่อสร้าง funnel + email collection

### ต้องเตรียมเอกสาร
- License Agreement ไทย/อังกฤษ สำหรับทั้ง 4 tier
- Terms of Service
- Privacy Policy (PDPA compliant)
- Refund Policy (มาตรฐานคือ "ไฟล์ดิจิทัลไม่คืนเงิน" แต่เคลมได้ถ้าไฟล์เสีย)

---

## 5. Core Features (MVP — เฟสแรก)

### 5.1 Public Site

**หน้า Home**
- Featured beats (3–6 ตัว)
- Hero section พร้อม value prop
- New releases
- Free beats download
- Newsletter signup

**หน้า Browse Beats**
- Grid/list view บีททั้งหมด
- Filter: BPM (slider), Key (dropdown), Genre, Mood, ราคา, Tag
- Sort: ใหม่สุด / ขายดี / ราคา / ความนิยม
- Search box (ชื่อบีท, mood, vibe)
- Pagination หรือ infinite scroll

**หน้า Beat Detail**
- Waveform player ขนาดใหญ่ (wavesurfer.js)
- ข้อมูล: BPM, Key, Genre, Mood, Tags, ความยาว, วันอัปโหลด
- License selector (เลือก tier → ราคาเปลี่ยน)
- ปุ่ม "Add to Cart" / "Buy Now"
- Related beats
- Share buttons (Facebook, X, Line)

**Persistent Audio Player**
- Sticky ที่ขอบล่างจอ
- ไม่หยุดเมื่อเปลี่ยนหน้า
- Play/Pause, Next/Prev, Volume, Progress bar
- คลิกชื่อบีท → ไปหน้า detail
- Queue ของบีทที่กำลังเล่น

### 5.2 Cart & Checkout

- Cart icon + counter ที่ navbar
- หน้า Cart: รายการบีท + license ที่เลือก, รวมราคา, ปุ่ม checkout
- Checkout flow:
  1. ตรวจสอบบีท + license
  2. กรอกอีเมล (สมัครสมาชิกอัตโนมัติ)
  3. เลือกวิธีจ่าย (PromptPay / บัตร)
  4. ชำระเงิน
  5. หน้า Success + ปุ่มดาวน์โหลด + ส่งอีเมล

### 5.3 User Account

- Login/Register (Email + Google)
- หน้า My Library: ดูบีทที่ซื้อ + ปุ่มดาวน์โหลดซ้ำ
- หน้า Order History
- หน้า License PDF download (ดู/ดาวน์โหลด license agreement)
- ไม่มี wishlist ใน MVP (เพิ่มทีหลัง)

### 5.4 Auto File Delivery

- หลังจ่ายเงินสำเร็จ ระบบสร้าง signed URL จาก Cloudflare R2
- ส่งอีเมลพร้อมลิงก์ดาวน์โหลด (หมดอายุ 48 ชม.)
- License agreement PDF generated อัตโนมัติ พร้อมข้อมูลผู้ซื้อ
- ลูกค้าดาวน์โหลดซ้ำได้จาก My Library

### 5.5 Admin Dashboard (สำหรับเจ้าของ)

- Upload beat: ใส่ไฟล์ WAV + Stems → ระบบสร้าง MP3 preview + ผสม voice tag อัตโนมัติด้วย FFmpeg
- ตั้งราคาแต่ละ tier
- Edit/delete/publish/unpublish beat
- Sales dashboard: ยอดขาย, รายได้, top beats, ลูกค้าใหม่
- Customer list
- Coupon code (เพิ่มทีหลังก็ได้)

---

## 6. Post-MVP Features (เฟสถัดไป)

- Coupon / discount code
- Wishlist / favorites
- Beat bundle (ซื้อหลายบีทลด %)
- Producer collab features (รับโปรดิวเซอร์อื่นเข้ามา)
- Subscription tier (จ่ายรายเดือนได้บีทไม่จำกัด)
- Mobile app (React Native)
- AI tagging (auto-detect BPM, key, mood จาก waveform)
- Royalty tracking
- Affiliate program

---

## 7. Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (สำหรับ persistent audio player + cart)
- **Audio:** wavesurfer.js (waveform display + playback)
- **Forms:** react-hook-form + zod validation

### Backend
- **API:** Next.js API Routes (เริ่มต้นพอ, แยก service ได้ทีหลัง)
- **Auth:** Supabase Auth (email + Google + Facebook OAuth)
- **Audio Processing:** FFmpeg (สร้าง preview + ใส่ tag)

### Database
- **Supabase (PostgreSQL)**
- ใช้ Row Level Security สำหรับ access control

### Storage
- **Cloudflare R2** สำหรับไฟล์เสียง
- เหตุผล: bandwidth ฟรี — สำคัญมากเพราะลูกค้าจะ stream preview เยอะ
- Public bucket: preview MP3 (มี watermark)
- Private bucket: WAV + Stems (เข้าผ่าน signed URL เท่านั้น)

### Payment
- **Omise** — รับบัตรเครดิต + PromptPay + TrueMoney
- Webhook สำหรับยืนยัน payment

### Email
- **Resend** สำหรับ transactional email
- Template: order confirmation, download link, license PDF, newsletter

### Hosting
- **Vercel** สำหรับ Next.js
- **Supabase Cloud** สำหรับ DB + Auth
- **Cloudflare R2** สำหรับ file storage
- **Cloudflare** สำหรับ DNS + CDN

### Analytics & Monitoring
- **Google Analytics 4** + Meta Pixel
- **Sentry** สำหรับ error tracking
- **Vercel Analytics** สำหรับ performance

### Dev Tools
- **GitHub** สำหรับ code repo
- **GitHub Actions** สำหรับ CI (test + lint)
- **Vercel Preview** สำหรับ test branch

---

## 8. System Architecture (High-Level)

```
[ลูกค้า/Browser]
       |
       v
[Vercel — Next.js App]
   |          |          |
   v          v          v
[Supabase] [R2 Storage] [Omise Payment]
   |          |
   v          v
[FFmpeg]  [Email — Resend]
```

### Data Flow ตอนซื้อบีท
1. ลูกค้าเลือกบีท + license → Add to cart (state อยู่ใน Zustand + cookies)
2. Checkout → call Omise API สร้าง charge/QR
3. ลูกค้าจ่าย → Omise webhook → Next.js API
4. API ยืนยัน → สร้าง order record ใน Supabase
5. Generate signed URLs จาก R2 (TTL 48 ชม.)
6. Generate license PDF (pdfkit หรือ puppeteer)
7. ส่งอีเมลผ่าน Resend
8. Redirect ลูกค้าไปหน้า My Library

### Data Flow ตอนอัปโหลดบีท (Admin)
1. Admin upload WAV + Stems → R2 (private bucket)
2. Trigger FFmpeg job:
   - แปลงเป็น MP3 256kbps
   - ผสม voice tag (มี file pool ของ tag)
   - อัปโหลด preview ไปยัง R2 (public bucket)
3. บันทึก metadata ลง Supabase
4. Admin ตั้งราคา + กด publish

---

## 9. Database Schema (เบื้องต้น)

### users
- id (uuid, PK)
- email
- name
- provider (email/google/facebook)
- created_at

### beats
- id (uuid, PK)
- title
- description
- bpm (int)
- key (varchar — e.g. "C minor")
- genre (enum: hiphop, trap, rnb, drill)
- mood (array of tags)
- tags (array)
- duration_sec
- preview_url (R2 public)
- wav_path (R2 private)
- stems_path (R2 private)
- waveform_data (jsonb — สำหรับ wavesurfer)
- status (draft / published / sold_exclusive)
- created_at
- published_at

### beat_licenses
- id (uuid, PK)
- beat_id (FK)
- tier (enum: basic, premium, trackout, exclusive)
- price_thb (int)
- terms (jsonb — รายละเอียดสิทธิ์)
- is_available (bool)

### orders
- id (uuid, PK)
- user_id (FK)
- email (snapshot)
- total_thb (int)
- status (pending / paid / failed / refunded)
- payment_method (promptpay / card)
- omise_charge_id
- created_at
- paid_at

### order_items
- id (uuid, PK)
- order_id (FK)
- beat_id (FK)
- license_id (FK)
- price_thb (snapshot)
- license_pdf_path

### download_tokens
- id (uuid, PK)
- order_item_id (FK)
- signed_url
- expires_at
- download_count

### email_subscribers
- id (uuid, PK)
- email
- source (newsletter / freebeat / order)
- subscribed_at
- unsubscribed_at (nullable)

---

## 10. Key User Flows

### Flow A — ค้นบีท → ซื้อ → ดาวน์โหลด
1. เข้าหน้า Browse → filter BPM 140 + genre Trap
2. คลิกบีทที่ชอบ → หน้า detail
3. กด preview → ฟัง 30 วิ
4. เลือก license tier → Add to cart
5. ไป Cart → Checkout
6. กรอกอีเมล → เลือก PromptPay
7. สแกน QR จ่าย → ระบบยืนยัน
8. หน้า Success → ดาวน์โหลด + อีเมลส่ง
9. (ทีหลัง) เข้า My Library ดาวน์โหลดซ้ำได้

### Flow B — Free Beat Funnel
1. เห็นโพสต์ TikTok/IG → คลิกลิงก์
2. หน้า Free Beat → กรอกอีเมล
3. รับลิงก์ดาวน์โหลด + ถูกเพิ่มเข้า newsletter
4. (ทีหลัง) ส่งอีเมลโปรโมตบีทใหม่ → กลับมาซื้อ

### Flow C — อัปโหลดบีทใหม่ (Admin)
1. Admin login → Dashboard → Upload
2. ใส่ WAV + Stems + ข้อมูล (BPM, key, genre)
3. ระบบประมวลผล (preview + tag) — แสดง progress
4. ตั้งราคา 4 tier → Save as draft / Publish

---

## 11. SEO & Marketing Strategy

### SEO (priority สูงสุด — traffic ฟรีระยะยาว)
- ทุกบีทมีหน้า detail พร้อม meta tags + JSON-LD schema (MusicRecording)
- URL slug แบบ /beats/dark-trap-bpm-140-cmin-prod-by-yourname
- Sitemap.xml อัปเดตอัตโนมัติ
- Blog/Tag pages (เช่น "บีท Trap 140 BPM", "บีทแนว Drake")
- Internal linking ระหว่างบีทคล้ายๆ กัน

### Content Marketing
- YouTube channel — อัปโหลดบีทเป็น video ทุกตัว, ลิงก์ในคำบรรยาย
- TikTok — ตัด snippet 15–30 วิ + caption "บีทขายอยู่ใน [domain]"
- Instagram Reels — เหมือน TikTok
- Free beats — ปล่อยทุก 2 สัปดาห์เพื่อ build email list

### Paid (เฟสหลัง)
- Facebook/IG Ads target แร็ปเปอร์/นักทำเพลงไทย
- Google Ads สำหรับ keyword เฉพาะ ("ซื้อบีท trap", "บีทแร็ปไทย")

### Community
- ร่วมงานกับ micro-influencer (แร็ปเปอร์ followers 5K–50K)
- ลง Pantry/แร็ปไทย Facebook groups (อย่า spam)
- Sponsorship บีทให้แร็ปเปอร์ดังใช้

---

## 12. Legal & Compliance

### PDPA (Personal Data Protection Act)
- ขอ consent ตอนสมัครสมาชิก/newsletter
- มีหน้า Privacy Policy ภาษาไทย
- ลบข้อมูลได้ตามคำขอของผู้ใช้
- เก็บ data ในไทย/region ใกล้เคียง (Supabase Singapore region)

### License Agreement
- เขียนเป็นภาษาไทยให้เข้าใจง่าย + แนบ English version
- ระบุชัดเจนว่าใครมีสิทธิ์อะไร, ห้ามอะไร
- มีข้อกำหนดเรื่อง dispute resolution (ศาลไทย)

### ภาษี
- ถ้าขายเกิน 1.8 ล้าน/ปี → ต้องจด VAT
- เก็บ invoice/receipt ทุกออเดอร์
- ปรึกษานักบัญชีตั้งแต่เริ่ม

### Copyright
- ตรวจ sample ทุกตัวก่อนปล่อยบีท (royalty-free)
- ถ้าใช้ sample จาก Splice/Loopcloud → เก็บ license หลักฐาน
- ห้ามใช้ AI-generated voice ที่ลอกศิลปินจริง

---

## 13. Roadmap (ละเอียด)

### Phase 0 — Pre-Build (Week 1–2)
- [ ] ตั้งชื่อแบรนด์ + จดโดเมน + ออกแบบโลโก้
- [ ] เปิดบัญชี: Vercel, Supabase, Cloudflare, Omise, Resend, GitHub
- [ ] ร่าง License Agreement ทั้ง 4 tier
- [ ] เขียน Terms of Service + Privacy Policy
- [ ] เตรียม voice tag audio file
- [ ] เตรียมบีทอย่างน้อย 10 ตัวพร้อม metadata

### Phase 1 — MVP Build (Week 3–6)

**Week 3:**
- Setup Next.js project + Tailwind + Supabase
- Auth (email + Google)
- Database schema migration

**Week 4:**
- Beat browse page + filter/search
- Beat detail page + waveform player
- Persistent audio player
- Admin upload flow + FFmpeg processing

**Week 5:**
- Cart + checkout flow
- Omise integration (PromptPay + card)
- License PDF generation
- Email delivery (Resend)

**Week 6:**
- My Library + Order history
- Admin sales dashboard
- SEO basics (meta, sitemap, robots.txt)
- Bug fix + polish

### Phase 2 — Soft Launch (Week 7)
- Upload บีท 20–30 ตัว
- เปิดเว็บแบบ unannounced กับเพื่อน 5–10 คน
- เก็บ feedback + แก้ bug
- Setup analytics (GA4, Pixel, Sentry)

### Phase 3 — Public Launch (Week 8)
- ประกาศใน Facebook/Instagram/TikTok
- ปล่อย free beat ตัวแรก + ลิงก์ลงเพจ
- ส่งบีทให้ micro-influencer ลองใช้
- Run promotion: ส่วนลด 20% สัปดาห์แรก

### Phase 4 — Growth (Month 3–6)
- เพิ่ม coupon system
- เพิ่ม wishlist
- เริ่ม Facebook/Google Ads งบเล็ก
- ปล่อยบีทใหม่อย่างน้อย 4 ตัว/เดือน
- YouTube channel grow

### Phase 5 — Scale (Month 7–12)
- เพิ่ม subscription tier
- พิจารณารับโปรดิวเซอร์อื่นเข้ามา (multi-vendor)
- เพิ่ม mobile app (ถ้ายอดคุ้ม)

---

## 14. Cost Estimate

### Monthly Cost (ช่วงเริ่มต้น — traffic ต่ำ)

| Item | Cost (THB/เดือน) | หมายเหตุ |
|------|------------------|---------|
| Domain (.com) | ~35 | 400/ปี |
| Vercel | 0 | Hobby tier ฟรี (ถ้าเกิน upgrade เป็น $20) |
| Supabase | 0 | Free tier (500MB DB, 1GB storage) |
| Cloudflare R2 | ~50 | $0.015/GB ราคาถูกมาก |
| Omise | 0 (เก็บ % ต่อ tx) | บัตร 3.65%, PromptPay ถูกกว่า |
| Resend | 0 | 3,000 อีเมล/เดือน ฟรี |
| Sentry | 0 | Free tier |
| **รวม** | **~85 บาท/เดือน** | ก่อนค่าธรรมเนียม payment |

### One-time Setup
- โดเมน: 400 บาท
- โลโก้/branding: 0–5,000 บาท (ทำเองหรือจ้าง)
- Voice tag recording: 0–500 บาท

### เมื่อ Scale ขึ้น (1,000+ visitors/วัน)
- Vercel Pro: ~700 บาท/เดือน
- Supabase Pro: ~900 บาท/เดือน
- R2 storage + bandwidth: ~200–500 บาท/เดือน

---

## 15. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| ไฟล์โดนขโมย/ละเมิดลิขสิทธิ์ | สูง | Voice tag preview, ไฟล์เต็มผ่าน signed URL only, ลบ link หลัง 48 ชม. |
| Payment fail / abandon cart | กลาง | Multi-method (PP + card), retry email, abandoned cart recovery |
| ไม่มีคนเข้าเว็บ (cold start) | สูง | YouTube + TikTok + Free beats funnel, SEO from day 1 |
| Bandwidth cost บาน | กลาง | ใช้ R2 (egress ฟรี), bitrate preview ต่ำ (128kbps พอ) |
| คุณภาพบีทไม่ตรงตลาด | สูง | ปล่อย free beat รับ feedback ก่อน soft launch |
| คดี dispute สิทธิ์ใช้งาน | กลาง | License เขียนชัด, เก็บ log การซื้อทุกเคส |
| โดน Omise reject | กลาง | สำรอง GBPrimePay หรือ 2C2P |

---

## 16. Success Metrics (KPIs)

### North Star Metric
**Monthly Beat Sales Revenue (THB)**

### Secondary Metrics
- Unique visitors/เดือน
- Preview play count/visitor
- Conversion rate (visitor → cart → paid)
- Average Order Value (AOV)
- Email subscribers
- Repeat purchase rate
- Average license tier (mix ของ basic vs premium vs exclusive)

### Target Phase 1 (เดือน 3)
- 1,000+ unique visitors/เดือน
- 1.5%+ conversion rate
- 10+ orders/เดือน
- AOV 800 บาท

### Target Phase 2 (เดือน 6)
- 3,000+ unique visitors/เดือน
- 2%+ conversion rate
- 30+ orders/เดือน
- AOV 1,000 บาท

---

## 17. Open Questions (ต้องตัดสินใจ)

- ชื่อแบรนด์/โดเมนคืออะไร?
- ใช้ voice tag เสียงตัวเองหรือจ้างคนพากย์?
- เริ่มต้นด้วยบีทกี่ตัวก่อนเปิดเว็บ?
- จะมีคนช่วย (designer/dev) หรือทำคนเดียว?
- ตั้งใจทำเป็นงานหลักหรืองานเสริม? (มีผลต่อความเร็ว)

---

## 18. Next Steps

1. ตอบ Open Questions ข้างบน
2. เลือกชื่อแบรนด์ + จดโดเมน
3. เปิดบัญชี service ที่จำเป็น (Vercel, Supabase, Cloudflare, Omise)
4. ตัดสินใจว่าจะเริ่ม build จากส่วนไหนก่อน:
   - **Database schema** (เก่าให้ผมร่าง SQL migration)
   - **License Agreement** (ผมร่างเป็นไทยให้)
   - **Next.js project skeleton** (setup + auth + browse page)

---

*เอกสารนี้เป็นเวอร์ชันแรก ปรับได้ตลอดเมื่อมีข้อมูลใหม่หรือเปลี่ยนแผน*
