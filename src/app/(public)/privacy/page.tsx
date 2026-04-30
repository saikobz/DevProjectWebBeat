import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว - WebBeatTH",
  description: "นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA) WebBeatTH"
};

export default function PrivacyPage() {
  return (
    <Card className="space-y-6 p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">Draft — ต้องให้ทนายความตรวจสอบก่อนใช้จริง</p>
      <h1 className="text-3xl font-black text-white sm:text-4xl">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
      <p className="text-sm text-zinc-400">
        WebBeatTH ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) — เอกสารนี้เป็นร่างสำหรับ MVP
      </p>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">1. ผู้ควบคุมข้อมูลส่วนบุคคล</h2>
        <p>
          WebBeatTH (ผู้ให้บริการเว็บไซต์ขายบีท) เป็นผู้กำหนดวัตถุประสงค์และวิธีการประมวลผลข้อมูลส่วนบุคคลของท่านในกรอบของบริการนี้
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">2. ข้อมูลที่เราอาจเก็บ</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>ข้อมูลบัญชี: อีเมล ชื่อที่ใช้แสดง รหัสผ่านที่เข้ารหัสโดยผู้ให้บริการ Auth</li>
          <li>ข้อมูลการซื้อ: รายการคำสั่งซื้อ ยอดเงิน วิธีชำระเงิน (ผ่านผู้ให้บริการชำระเงิน)</li>
          <li>ข้อมูลการติดต่อสื่อสาร: อีเมลจากฟอร์ม newsletter หรือ free beat funnel</li>
          <li>ข้อมูลทางเทคนิค: log การใช้งานที่จำเป็นเพื่อความปลอดภัยและการให้บริการ</li>
        </ul>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">3. วัตถุประสงค์ในการใช้ข้อมูล</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>ให้บริการสมัครสมาชิก เข้าสู่ระบบ และจัดการบัญชี</li>
          <li>ดำเนินการสั่งซื้อ ชำระเงิน ส่งมอบไฟล์ และใบอนุญาต</li>
          <li>ส่งอีเมลแจ้งคำสั่งซื้อ ลิงก์ดาวน์โหลด และข้อมูลที่เกี่ยวข้องกับบริการ</li>
          <li>ส่งข่าวสารหรือโปรโมชันเมื่อท่านให้ความยินยอม (เช่น การสมัครรับจดหมายข่าว)</li>
          <li>ปฏิบัติตามกฎหมายและป้องกันการทุจริต</li>
        </ul>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">4. ฐานทางกฎหมาย</h2>
        <p>
          เราประมวลผลข้อมูลบนฐานความยินยอมของท่าน การปฏิบัติตามสัญญา (การซื้อบีท) หรือฐานทางกฎหมายอื่นตาม PDPA ที่เกี่ยวข้อง
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">5. การเปิดเผยข้อมูลแก่บุคคลที่สาม</h2>
        <p>
          เราอาจใช้ผู้ให้บริการภายนอกที่น่าเชื่อถือ เช่น ผู้ให้บริการฐานข้อมูลและ Auth ระบบชำระเงิน ที่เก็บไฟล์ อีเมล และการวิเคราะห์การใช้งาน
          ผู้ให้บริการเหล่านี้ประมวลผลข้อมูลตามสัญญากับเราและเฉพาะเท่าที่จำเป็น
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">6. การเก็บรักษาและระยะเวลา</h2>
        <p>
          เก็บข้อมูลเท่าที่จำเป็นตามระยะเวลาที่เกี่ยวข้องกับบัญชี ภาระผูกพันทางภาษี/บัญชี หรือการระงับข้อพิพาท แล้วจึดทำลายหรือทำให้ไม่สามารถระบุตัวบุคคลได้เมื่อไม่จำเป็น
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">7. สิทธิของเจ้าของข้อมูล</h2>
        <p>
          ท่านมีสิทธิขอเข้าถึง คัดลอก แก้ไข ลบ ระงับ คัดค้าน หรือถอนความยินยอม รวมถึงสิทธิอื่นตาม PDPA โดยติดต่อผู้ให้บริการตามช่องทางที่กำหนด
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">8. การร้องเรียน</h2>
        <p>
          หากท่านเห็นว่าการประมวลผลของเราไม่ชอบด้วยกฎหมาย ท่านมีสิทธิร้องเรียนต่อหน่วยงานที่เกี่ยวข้องตาม PDPA
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">9. การเปลี่ยนแปลงนโยบาย</h2>
        <p>
          เราอาจปรับปรุงนโยบายนี้และจะแจ้งให้ทราบตามความเหมาะสม (เช่น ประกาศบนเว็บไซต์หรืออีเมล)
        </p>
      </section>

      <p className="border-t border-zinc-800 pt-6 text-sm text-zinc-500">
        <Link className="text-lime-300 hover:underline" href="/terms">
          ข้อกำหนดการใช้บริการ
        </Link>
      </p>
    </Card>
  );
}
