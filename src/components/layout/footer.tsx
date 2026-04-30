import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-10 text-center text-sm text-zinc-500">
      <p className="font-medium text-zinc-400">WebBeatTH — Thai beat marketplace MVP</p>
      <nav aria-label="Legal" className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <Link className="text-zinc-400 transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950" href="/terms">
          ข้อกำหนดการใช้บริการ
        </Link>
        <Link className="text-zinc-400 transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950" href="/privacy">
          นโยบายความเป็นส่วนตัว
        </Link>
        <Link className="text-zinc-400 transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950" href="/refund">
          นโยบายการคืนเงิน
        </Link>
      </nav>
    </footer>
  );
}
