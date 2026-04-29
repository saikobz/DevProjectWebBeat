"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/stores/cart-store";

export function Nav() {
  const count = useCartStore((state) => state.items.length);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function logout() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setEmail(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-black tracking-tight text-white">
          WebBeat<span className="text-lime-300">TH</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <Link href="/beats" className="hover:text-white">Beats</Link>
          <Link href="/free" className="hover:text-white">Free Beat</Link>
          <Link href="/library" className="hover:text-white">Library</Link>
          <Link href="/admin" className="hover:text-white">Admin</Link>
          {email ? (
            <button className="hover:text-white" type="button" onClick={() => void logout()}>
              Logout
            </button>
          ) : (
            <Link href="/login" className="hover:text-white">Login</Link>
          )}
        </div>
        <Link href="/cart" className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white">
          <ShoppingCart size={16} />
          Cart
          <span className="rounded-full bg-lime-300 px-2 py-0.5 text-xs font-bold text-zinc-950">{count}</span>
        </Link>
      </nav>
    </header>
  );
}
