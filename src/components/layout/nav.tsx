"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/stores/cart-store";

export function Nav() {
  const count = useCartStore((state) => state.items.length);
  const [email, setEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const cartAriaLabel = count === 0 ? "ตะกร้าสินค้า ยังไม่มีรายการ" : `ตะกร้าสินค้า ${count} รายการ`;

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

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        queueMicrotask(() => menuButtonRef.current?.focus());
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

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
            <Link href="/beats" className={navLinkClass}>
              บีท
            </Link>
            <Link href="/free" className={navLinkClass}>
              ฟรีบีท
            </Link>
            <Link href="/library" className={navLinkClass}>
              คลังเพลง
            </Link>
            <Link href="/admin" className={navLinkClass}>
              แอดมิน
            </Link>
            {email ? (
              <button className={navLinkClass} type="button" onClick={() => void logout()}>
                ออกจากระบบ
              </button>
            ) : (
              <Link href="/login" className={navLinkClass}>
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              ref={menuButtonRef}
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
              aria-label={cartAriaLabel}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:px-4"
            >
              <ShoppingCart size={16} aria-hidden />
              <span className="hidden sm:inline">ตะกร้า</span>
              <span className="rounded-full bg-lime-300 px-2 py-0.5 text-xs font-bold text-zinc-950">{count}</span>
            </Link>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div id="mobile-navigation" className="mt-4 grid gap-2 border-t border-zinc-800 pt-4 md:hidden">
            <Link href="/beats" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              บีท
            </Link>
            <Link href="/free" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              ฟรีบีท
            </Link>
            <Link href="/library" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              คลังเพลง
            </Link>
            <Link href="/admin" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              แอดมิน
            </Link>
            {email ? (
              <button className={`${mobileNavLinkClass} text-left`} type="button" onClick={() => void logout()}>
                ออกจากระบบ
              </button>
            ) : (
              <Link href="/login" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
