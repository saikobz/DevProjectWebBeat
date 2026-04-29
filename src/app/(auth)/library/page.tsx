import { LibraryView } from "@/components/library/library-view";
import { getOrdersForUser } from "@/lib/data/orders";
import { requireUser } from "@/lib/auth/session";

export default async function LibraryPage() {
  const user = await requireUser();
  const orders = await getOrdersForUser(user.id, true);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Library</p>
        <h1 className="mt-3 text-4xl font-black text-white">My Library</h1>
      </div>
      <LibraryView orders={orders} />
    </div>
  );
}
