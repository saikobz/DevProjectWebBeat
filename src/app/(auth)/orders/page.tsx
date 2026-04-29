import { LibraryView } from "@/components/library/library-view";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Orders</p>
        <h1 className="mt-3 text-4xl font-black text-white">Order History</h1>
      </div>
      <LibraryView />
    </div>
  );
}
