import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "ข้อกำหนดการใช้บริการ - WebBeatTH",
  description: "ข้อกำหนดการใช้บริการเว็บไซต์ขายบีท WebBeatTH"
};

export default function TermsPage() {
  return (
    <Card className="space-y-6 p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">Draft — ต้องให้ทนายความตรวจสอบก่อนใช้จริง</p>
      <h1 className="text-3xl font-black text-white sm:text-4xl">ข้อกำหนดการใช้บริการ (Terms of Service)</h1>
      <p className="text-sm text-zinc-400">อัปเดตล่าสุด: เวอร์ชันร่างสำหรับ MVP — WebBeatTH</p>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">1. การยอมรับข้อตกลง</h2>
        <p>
          การเข้าใช้งานเว็บไซต์และบริการของ WebBeatTH ถือว่าท่านยอมรับข้อกำหนดนี้ หากไม่ยอมรับ โปรดงดใช้งานบริการ
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">2. คำอธิบายบริการ</h2>
        <p>
          WebBeatTH เป็นแพลตฟอร์มจำหน่ายไฟล์เสียง (instrumental beats) และใบอนุญาตใช้งานตามระดับที่ระบุในแต่ละคำสั่งซื้อ
          ไฟล์และสิทธิ์ใช้งานเป็นไปตามข้อความในใบอนุญาต (license) ที่แนบกับคำสั่งซื้อของท่าน
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">3. บัญชีผู้ใช้</h2>
        <p>
          ท่านต้องให้ข้อมูลที่เป็นจริงและรักษาความปลอดภัยของรหัสผ่าน หากพบการใช้งานโดยไม่ได้รับอนุญาต โปรดแจ้งผู้ให้บริการทันที
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">4. ทรัพย์สินทางปัญญา</h2>
        <p>
          บีทและเนื้อหาบนเว็บไซต์เป็นทรัพย์สินของผู้ให้อนุญาตหรือผู้ถือลิขสิทธิ์ การซื้อใบอนุญาตไม่ได้โอนความเป็นเจ้าของลิขสิทธิ์ในตัวบีท ยกเว้นระดับ Exclusive ที่ระบุไว้ชัดในใบอนุญาต
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">5. พฤติกรรมต้องห้าม</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>แจกจ่ายไฟล์เต็มหรือขายต่อโดยไม่ได้รับอนุญาตตาม license</li>
          <li>ละเมิดลิขสิทธิ์ของบุคคลที่สามหรือใช้บีทในเนื้อหาที่ผิดกฎหมาย</li>
          <li>พยายามโจมตีระบบ ดึงข้อมูลโดยไม่ได้รับอนุญาต หรือรบกวนการให้บริการของผู้อื่น</li>
        </ul>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">6. การชำระเงินและการคืนเงิน</h2>
        <p>
          รายละเอียดการชำระเงินดำเนินการผ่านผู้ให้บริการชำระเงินที่เว็บไซต์เลือกใช้ สินค้าดิจิทัลมักไม่คืนเงินหลังส่งมอบไฟล์ ยกเว้นกรณีที่ระบุใน{" "}
          <Link className="font-semibold text-lime-300 underline-offset-4 hover:underline" href="/refund">
            นโยบายการคืนเงิน
          </Link>
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">7. การระงับหรือยกเลิกบริการ</h2>
        <p>
          ผู้ให้บริการอาจระงับหรือยุติการให้บริการหากมีการละเมิดข้อตกลงหรือเหตุจำเป็นโดยชอบด้วยกฎหมาย
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">8. ข้อจำกัดความรับผิด</h2>
        <p>
          การใช้บริการอยู่บนพื้นฐาน &quot;ตามสภาพ&quot; ผู้ให้บริการไม่รับประกันว่าบริการจะปลอดข้อผิดพลาดหรือไม่ขาดตอนตลอดเวลา ความเสียหายที่เกิดจากการใช้งานนอกเหนือจากที่กฎหมายห้ามปฏิเสธจะอยู่ในวงที่สมเหตุสมผลตามที่กฎหมายกำหนด
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">9. กฎหมายที่ใช้บังคับ</h2>
        <p>
          ข้อพิพาทให้ใช้กฎหมายไทย และเขตอำนาจศาลตามที่ระบุในเอกสารทางธุรกิจของผู้ให้บริการ (ปรับให้ตรงคำแนะนำทนาย)
        </p>
      </section>

      <section className="space-y-3 text-zinc-300">
        <h2 className="text-xl font-bold text-white">10. การติดต่อ</h2>
        <p>
          หากมีคำถามเกี่ยวกับข้อกำหนดนี้ โปรดติดต่อผู้ให้บริการผ่านช่องทางที่ระบุบนเว็บไซต์ (เพิ่มอีเมล/ฟอร์มเมื่อพร้อม)
        </p>
      </section>

      <p className="border-t border-zinc-800 pt-6 text-sm text-zinc-500">
        ดูเพิ่มเติม:{" "}
        <Link className="text-lime-300 hover:underline" href="/privacy">
          นโยบายความเป็นส่วนตัว
        </Link>
      </p>
    </Card>
  );
}
