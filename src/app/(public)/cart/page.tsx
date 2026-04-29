import { CartView } from "@/components/cart/cart-view";

export default function CartPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Cart</p>
        <h1 className="mt-3 text-4xl font-black text-white">ตะกร้าสินค้า</h1>
      </div>
      <CartView />
    </div>
  );
}
