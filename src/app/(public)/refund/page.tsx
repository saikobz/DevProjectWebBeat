import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "นโยบายการคืนเงิน - WebBeatTH",
  description: "นโยบายการคืนเงินสำหรับสินค้าดิจิทัล WebBeatTH"
};

export default function RefundPage() {
  return (
    <Card className="space-y-6 p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">Draft — ต้องให้ทนายความตรวจสอบก่อนใช้จริง</p>
      <h1 className="text-3xl font-black text-white sm:text-4xl">นโยบายการคืนเงิน</h1>
      <p className="text-sm text-zinc-400">ใช้กับการจำหน่ายไฟล์เสียงและใบอนุญาต (license) แบบดิจิทัล</p>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">ลักษณะสินค้า</h2>
        <p>
          สินค้าที่จำหน่ายผ่าน WebBeatTH เป็นสินค้าดิจิทัลที่ส่งมอบทางดาวน์โหลดหรือลิงก์ชั่วคราว หลังส่งมอบสำเร็จ ท่านได้รับสำเนาไฟล์แล้ว
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">หลักการทั่วไป</h2>
        <p>
          โดยทั่วไป <strong className="text-white">เราไม่คืนเงินสำหรับการซื้อสินค้าดิจิทัล</strong> หลังจากท่านได้รับไฟล์หรือลิงก์ดาวน์โหลดแล้ว
          เนื่องจากไม่สามารถ &quot;คืนสินค้า&quot; ในลักษณะเดียวกับสินค้าทางกายภาพได้
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">กรณีพิเศษที่พิจารณาแก้ไขหรือคืนเงิน</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>ไฟล์ที่ดาวน์โหลดเสียหายหรือเปิดไม่ได้ และทีมงานยืนยันจากข้อมูลทางเทคนิคได้</li>
          <li>ชำระเงินสำเร็จแต่ระบบไม่ส่งมอบไฟล์หรือใบอนุญาตภายในระยะเวลาที่สมเหตุสมผล</li>
          <li>คำสั่งซื้อซ้ำโดยไม่ได้ตั้งใจสำหรับรายการเดียวกันในระยะเวลาสั้น — พิจารณาเป็นรายกรณี</li>
        </ul>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">วิธีติดต่อ</h2>
        <p>
          หากเข้าเงื่อนไขข้างต้น โปรดติดต่อผู้ให้บริการพร้อมหมายเลขคำสั่งซื้อและหลักฐานการชำระเงิน (เพิ่มอีเมล/ฟอร์มเมื่อพร้อม)
        </p>
      </section>

      <p className="border-t border-zinc-800 pt-6 text-sm text-zinc-500">
        <Link className="text-lime-300 hover:underline" href="/terms">
          ข้อกำหนดการใช้บริการ
        </Link>{" "}
        ·{" "}
        <Link className="text-lime-300 hover:underline" href="/privacy">
          นโยบายความเป็นส่วนตัว
        </Link>
      </p>
    </Card>
  );
}
