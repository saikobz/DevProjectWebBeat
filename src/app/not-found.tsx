import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-black text-white">ไม่พบหน้านี้</h1>
      <p className="mt-3 text-zinc-400">URL นี้ยังไม่มีใน MVP</p>
      <LinkButton href="/" className="mt-6">กลับหน้าแรก</LinkButton>
    </div>
  );
}
