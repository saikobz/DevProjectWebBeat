"use client";

import { useMemo, useState } from "react";
import { getPublishedBeats, mockBeats } from "@/lib/data/mock-beats";
import { formatTHB } from "@/lib/format";
import type { Beat } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AdminBeatManager() {
  const [beats, setBeats] = useState<Beat[]>(mockBeats);
  const published = getPublishedBeats();
  const revenue = useMemo(
    () => beats.reduce((total, beat) => total + beat.saleCount * Math.min(...beat.licenses.map((license) => license.priceThb)), 0),
    [beats]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-400">Published beats</p>
          <p className="mt-2 text-3xl font-black text-white">{published.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-400">Mock sales</p>
          <p className="mt-2 text-3xl font-black text-white">{beats.reduce((total, beat) => total + beat.saleCount, 0)}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-400">Estimated revenue</p>
          <p className="mt-2 text-3xl font-black text-lime-300">{formatTHB(revenue)}</p>
        </Card>
      </div>
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Beats</h2>
            <p className="text-sm text-zinc-400">MVP admin ใช้ mock data ก่อนต่อ Supabase CRUD จริง</p>
          </div>
          <Button
            onClick={() =>
              setBeats((current) => [
                {
                  ...current[0],
                  id: `beat-${current.length + 1}`,
                  slug: `new-demo-beat-${current.length + 1}`,
                  title: `New Demo Beat ${current.length + 1}`,
                  status: "draft",
                  saleCount: 0,
                  isFeatured: false
                },
                ...current
              ])
            }
          >
            Add mock beat
          </Button>
        </div>
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
                  <td className="py-4 text-zinc-400">{beat.saleCount}</td>
                  <td className="py-4 text-right">
                    <button
                      className="text-lime-300"
                      type="button"
                      onClick={() =>
                        setBeats((current) =>
                          current.map((item) =>
                            item.id === beat.id
                              ? { ...item, status: item.status === "published" ? "draft" : "published" }
                              : item
                          )
                        )
                      }
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
