"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/stores/cart-store";

export function Nav() {
  const count = useCartStore((state) => state.items.length);
  const [email, setEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass =
    "rounded-full px-3 py-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
  const mobileNavLinkClass =
    "rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

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
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-md text-lg font-black tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            onClick={() => setIsMobileMenuOpen(false)}
          >
          WebBeat<span className="text-lime-300">TH</span>
          </Link>
          <div className="hidden items-center gap-2 text-sm text-zinc-300 md:flex">
            <Link href="/beats" className={navLinkClass}>Beats</Link>
            <Link href="/free" className={navLinkClass}>Free Beat</Link>
            <Link href="/library" className={navLinkClass}>Library</Link>
            <Link href="/admin" className={navLinkClass}>Admin</Link>
            {email ? (
              <button className={navLinkClass} type="button" onClick={() => void logout()}>
                Logout
              </button>
            ) : (
              <Link href="/login" className={navLinkClass}>Login</Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-white transition hover:border-zinc-700 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
              onClick={() => setIsMobileMenuOpen((value) => !value)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link
              href="/cart"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:px-4"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              <span className="rounded-full bg-lime-300 px-2 py-0.5 text-xs font-bold text-zinc-950">{count}</span>
            </Link>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div id="mobile-navigation" className="mt-4 grid gap-2 border-t border-zinc-800 pt-4 md:hidden">
            <Link href="/beats" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              Beats
            </Link>
            <Link href="/free" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              Free Beat
            </Link>
            <Link href="/library" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              Library
            </Link>
            <Link href="/admin" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              Admin
            </Link>
            {email ? (
              <button className={`${mobileNavLinkClass} text-left`} type="button" onClick={() => void logout()}>
                Logout
              </button>
            ) : (
              <Link href="/login" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
