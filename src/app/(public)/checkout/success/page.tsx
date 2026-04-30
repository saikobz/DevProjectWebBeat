import { getOrderById } from "@/lib/data/orders";
import { formatTHB } from "@/lib/format";
import { CheckoutSuccessTracker } from "@/components/analytics/checkout-success-tracker";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams;
  const orderRecord = order ? await getOrderById(order) : null;

  return (
    <Card className="mx-auto max-w-2xl text-center">
      {orderRecord ? <CheckoutSuccessTracker order={orderRecord} /> : null}
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Payment Success</p>
      <h1 className="mt-4 text-4xl font-black text-white">รับคำสั่งซื้อแล้ว</h1>
      <p className="mt-4 text-zinc-300">
        {orderRecord
          ? `Order ${orderRecord.orderNumber} สถานะ ${orderRecord.status} ยอดรวม ${formatTHB(orderRecord.totalThb)}`
          : `Order ${order ?? "ล่าสุด"} ถูกสร้างแล้ว`}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/library">ไป My Library</LinkButton>
        <LinkButton href="/beats" variant="secondary">ซื้อบีทเพิ่ม</LinkButton>
      </div>
    </Card>
  );
}
