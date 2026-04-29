import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams;

  return (
    <Card className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Payment Success</p>
      <h1 className="mt-4 text-4xl font-black text-white">ชำระเงิน mock สำเร็จ</h1>
      <p className="mt-4 text-zinc-300">
        Order {order ?? "ล่าสุด"} ถูกบันทึกไว้ใน browser localStorage เพื่อจำลอง My Library ก่อนต่อ Supabase/Omise จริง
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/library">ไป My Library</LinkButton>
        <LinkButton href="/beats" variant="secondary">ซื้อบีทเพิ่ม</LinkButton>
      </div>
    </Card>
  );
}
