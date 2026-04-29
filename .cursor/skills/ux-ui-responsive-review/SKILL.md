---
name: ux-ui-responsive-review
description: Reviews UX, UI quality, accessibility, and responsive behavior like a senior product designer/front-end reviewer. Use when the user asks to check UX, UI, responsive design, mobile layout, visual polish, usability, accessibility, design QA, or screen-by-screen product experience.
---

# UX/UI Responsive Review

## Purpose

ใช้ skill นี้เมื่อผู้ใช้ต้องการตรวจ UX, UI, responsive design, mobile/tablet/desktop layout, usability, accessibility หรือ design QA แบบมืออาชีพ

เป้าหมายคือให้ feedback ที่ actionable, evidence-based และจัดลำดับความสำคัญตามผลกระทบต่อผู้ใช้ ไม่ใช่แค่ความสวยงาม

## Review Workflow

1. ระบุ context ก่อนรีวิว
   - Product goal คืออะไร
   - Primary user คือใคร
   - Key flow ที่ต้องสำเร็จคืออะไร
   - Screen/page/component ที่ต้องรีวิวคืออะไร

2. เก็บ evidence
   - ถ้ามี screenshot หรือ browser/runtime ให้รีวิวจากภาพและพฤติกรรมจริง
   - ถ้าไม่มี screenshot ให้ inspect code, component structure, CSS/Tailwind classes และถามหาภาพเฉพาะจุดเมื่อจำเป็น
   - อย่า claim ปัญหาด้าน visual ที่มองไม่เห็นจากหลักฐาน

3. ตรวจ responsive breakpoints
   - Mobile: 360px, 390px, 430px
   - Tablet: 768px, 834px
   - Desktop: 1024px, 1280px, 1440px
   - ตรวจ orientation, overflow, wrapping, sticky elements, bottom nav/player, modal และ form states

4. ตรวจ UX quality
   - Information hierarchy ชัดหรือไม่
   - User flow มี next step ชัดหรือไม่
   - CTA เด่นและตรง intent หรือไม่
   - Empty/loading/error/success states พร้อมหรือไม่
   - Form labels, validation, helper text และ error messages เข้าใจง่ายหรือไม่
   - Navigation และ back/escape paths ไม่ทำให้ user ติดหรือหลงทาง

5. ตรวจ UI quality
   - Spacing scale สม่ำเสมอ
   - Typography hierarchy อ่านง่าย
   - Contrast เพียงพอ
   - Alignment และ grid consistency ดี
   - Visual density เหมาะกับ screen size
   - Interactive states มี hover, focus, active, disabled
   - Icons, badges, cards, buttons ใช้ pattern เดียวกัน

6. ตรวจ accessibility
   - Keyboard navigation ใช้งานได้
   - Focus state มองเห็น
   - Touch target อย่างน้อยประมาณ 44x44px
   - Text input มี label ที่ชัด
   - Image มี alt เหมาะสม
   - Contrast ของ text/CTA พอใช้งานจริง
   - Semantic HTML ไม่ทำลาย screen reader flow

7. ตรวจ performance และ polish
   - Images ใช้ sizing เหมาะสม เช่น `sizes` สำหรับ `next/image` ที่ใช้ `fill`
   - Avoid layout shift
   - ไม่โหลด media/animation หนักเกินจำเป็น
   - Sticky/fixed UI ไม่บัง content หรือ CTA
   - State transition ไม่กระตุกหรือสับสน

## Severity

จัด findings ตาม severity นี้:

- Critical: ทำให้ user ทำ core task ไม่ได้ หรือมี accessibility blocker ร้ายแรง
- High: กระทบ conversion, navigation, checkout, form completion หรือ mobile usability ชัดเจน
- Medium: ลด usability/clarity แต่ยังใช้งานต่อได้
- Low: polish, consistency, microcopy หรือ visual refinement

## Output Format

ใช้รูปแบบนี้เมื่อรีวิว:

```markdown
## UX/UI Review

### Findings

- Severity: High
  Area: Checkout / Mobile 390px
  Issue: [อธิบายปัญหาจากหลักฐาน]
  Impact: [ผลกระทบต่อ user/business]
  Recommendation: [วิธีแก้ที่ชัดเจน]

### Responsive Matrix

- 360-430px: [summary]
- 768-834px: [summary]
- 1024px+: [summary]

### Quick Wins

- [small fix 1]
- [small fix 2]

### Open Questions

- [คำถามที่ต้องรู้ก่อนตัดสินใจ]
```

## Implementation Guidance

ถ้าผู้ใช้ขอให้แก้ UI:

1. อ่าน component/design pattern ที่มีอยู่ก่อน
2. ใช้ Tailwind/design tokens/pattern เดิมให้มากที่สุด
3. แก้เฉพาะจุดที่เกี่ยวกับ finding
4. อย่า refactor ใหญ่ถ้าไม่จำเป็น
5. หลังแก้ ให้ตรวจ lint/typecheck/build ตามความเหมาะสม
6. สรุปสิ่งที่แก้พร้อม screen/viewport ที่ควรทดสอบซ้ำ

## Review Principles

- Prioritize usability over decoration
- Prefer concrete recommendations over vague opinions
- Tie every finding to user impact
- Separate confirmed issues from assumptions
- Mention limitations if review is code-only and no visual evidence is available
- Keep feedback concise, professional, and actionable
