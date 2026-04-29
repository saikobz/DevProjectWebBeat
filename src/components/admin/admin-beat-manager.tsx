"use client";

import { useEffect, useMemo, useState } from "react";
import { formatTHB } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

type AdminBeatRow = {
  id: string;
  slug: string;
  title: string;
  genre: string;
  status: "draft" | "published" | "sold_exclusive";
  sale_count?: number;
  saleCount?: number;
  is_featured?: boolean;
};

type AdminStats = {
  beats: number;
  published: number;
  sales: number;
  revenueThb: number;
};

export function AdminBeatManager() {
  const [beats, setBeats] = useState<AdminBeatRow[]>([]);
  const [stats, setStats] = useState<AdminStats>({ beats: 0, published: 0, sales: 0, revenueThb: 0 });
  const [error, setError] = useState<string | null>(null);
  const totalSales = useMemo(() => beats.reduce((total, beat) => total + (beat.sale_count ?? beat.saleCount ?? 0), 0), [beats]);

  useEffect(() => {
    async function loadAdminData() {
      const [beatsResponse, statsResponse] = await Promise.all([fetch("/api/admin/beats"), fetch("/api/admin/stats")]);
      const beatsResult = (await beatsResponse.json()) as { beats?: AdminBeatRow[]; error?: string };
      const statsResult = (await statsResponse.json()) as AdminStats & { error?: string };

      if (!beatsResponse.ok || !statsResponse.ok) {
        setError(beatsResult.error ?? statsResult.error ?? "โหลดข้อมูล admin ไม่สำเร็จ");
        return;
      }

      setBeats(beatsResult.beats ?? []);
      setStats(statsResult);
    }

    void loadAdminData();
  }, []);

  async function togglePublish(beat: AdminBeatRow) {
    const nextStatus = beat.status === "published" ? "draft" : "published";
    const response = await fetch(`/api/admin/beats/${beat.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: nextStatus })
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error ?? "อัปเดตสถานะบีทไม่สำเร็จ");
      return;
    }

    setBeats((current) => current.map((item) => (item.id === beat.id ? { ...item, status: nextStatus } : item)));
    setStats((current) => ({
      ...current,
      published: current.published + (nextStatus === "published" ? 1 : -1)
    }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-400">Published beats</p>
          <p className="mt-2 text-3xl font-black text-white">{stats.published}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-400">Paid orders</p>
          <p className="mt-2 text-3xl font-black text-white">{stats.sales || totalSales}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-400">Revenue</p>
          <p className="mt-2 text-3xl font-black text-lime-300">{formatTHB(stats.revenueThb)}</p>
        </Card>
      </div>
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Beats</h2>
            <p className="text-sm text-zinc-400">จัดการข้อมูลบีทผ่าน Supabase เมื่อ env พร้อม</p>
          </div>
          <LinkButton href="/admin/beats/new">Add beat</LinkButton>
        </div>
        {error ? <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="py-3">Title</th>
                <th className="py-3">Genre</th>
                <th className="py-3">Status</th>
                <th className="py-3">Sales</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {beats.map((beat) => (
                <tr key={beat.id}>
                  <td className="py-4 font-semibold text-white">{beat.title}</td>
                  <td className="py-4 text-zinc-400">{beat.genre}</td>
                  <td className="py-4 text-zinc-400">{beat.status}</td>
                  <td className="py-4 text-zinc-400">{beat.sale_count ?? beat.saleCount ?? 0}</td>
                  <td className="py-4 text-right">
                    <button
                      className="text-lime-300"
                      type="button"
                      onClick={() => void togglePublish(beat)}
                    >
                      {beat.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
