import { LibraryView } from "@/components/library/library-view";
import { requireUser } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/data/orders";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getOrdersForUser(user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Orders</p>
        <h1 className="mt-3 text-4xl font-black text-white">Order History</h1>
      </div>
      <LibraryView orders={orders} emptyMessage="ยังไม่มีประวัติออเดอร์" />
    </div>
  );
}
