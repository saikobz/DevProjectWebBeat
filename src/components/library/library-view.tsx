import { formatDateTime, formatTHB } from "@/lib/format";
import type { Order } from "@/types";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

type LibraryViewProps = {
  orders: Order[];
  emptyMessage?: string;
};

export function LibraryView({ orders, emptyMessage = "ยังไม่มี order ที่ชำระสำเร็จ" }: LibraryViewProps) {
  if (orders.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-white">My Library</h1>
        <p className="mt-2 text-zinc-400">{emptyMessage}</p>
        <LinkButton href="/beats" className="mt-6">Browse Beats</LinkButton>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <div className="flex flex-col justify-between gap-2 md:flex-row">
            <div>
              <p className="font-bold text-white">{order.orderNumber}</p>
              <p className="text-sm text-zinc-300">{order.customerName}</p>
              <p className="text-sm text-zinc-400">{formatDateTime(order.paidAt ?? order.createdAt)}</p>
            </div>
            <p className="font-bold text-lime-300">{formatTHB(order.totalThb)}</p>
          </div>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <div key={item.licenseId} className="flex flex-col justify-between gap-2 rounded-2xl bg-zinc-950 p-4 md:flex-row md:items-center">
                <div>
                  <p className="font-semibold text-white">{item.beatTitle}</p>
                  <p className="text-sm text-zinc-400">{item.licenseName}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {item.downloadLinks?.length ? (
                    item.downloadLinks.map((link) => (
                      <a className="text-sm font-semibold text-lime-300" download rel="noreferrer" href={link.url} key={link.url}>
                        {link.label}
                      </a>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-500">รอสร้างลิงก์ดาวน์โหลด</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
