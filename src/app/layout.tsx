import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PersistentPlayer } from "@/components/player/persistent-player";

export const metadata: Metadata = {
  title: "WebBeatTH - Thai Beat Marketplace",
  description: "เว็บขายบีทสำหรับแร็ปเปอร์และนักทำเพลงไทย"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Nav />
        <main className="mx-auto min-h-[calc(100vh-160px)] max-w-6xl px-4 py-10 pb-32">{children}</main>
        <Footer />
        <PersistentPlayer />
      </body>
    </html>
  );
}
