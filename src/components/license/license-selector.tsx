"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { formatTHB } from "@/lib/format";
import { LICENSE_ORDER } from "@/lib/constants";
import { getLicenseTierConfig } from "@/lib/license/terms";
import { useCartStore } from "@/stores/cart-store";
import type { Beat, BeatLicense } from "@/types";
import { Button, LinkButton } from "@/components/ui/button";

type LicenseSelectorProps = {
  beat: Beat;
};

export function LicenseSelector({ beat }: LicenseSelectorProps) {
  const sortedLicenses = useMemo(
    () => [...beat.licenses].sort((a, b) => LICENSE_ORDER.indexOf(a.tier) - LICENSE_ORDER.indexOf(b.tier)),
    [beat.licenses]
  );
  const [selected, setSelected] = useState<BeatLicense>(sortedLicenses[0]);
  const [addedLicenseId, setAddedLicenseId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {sortedLicenses.map((license) => (
          <button
            key={license.id}
            type="button"
            onClick={() => {
              setSelected(license);
              setAddedLicenseId(null);
            }}
            className={
              selected.id === license.id
                ? "min-h-11 rounded-2xl border border-lime-300 bg-lime-300/10 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                : "min-h-11 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{license.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{getLicenseTierConfig(license.tier).summary}</p>
              </div>
              <span className="font-bold text-lime-300">{formatTHB(license.priceThb)}</span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              {license.terms.streamLimit ? `จำกัด ${license.terms.streamLimit.toLocaleString("th-TH")} streams/sales` : "ไม่จำกัด streams/sales"}
              {" - "}
              {license.terms.exclusive ? "exclusive" : "non-exclusive"}
              {" - "}
              publishing split {license.terms.publishingSplit.licensee}/{license.terms.publishingSplit.producer}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
              {license.files.map((file) => (
                <span key={file} className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-1">
                  <Check size={12} /> {file}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      <Button
        className="w-full"
        onClick={() => {
          addItem(beat, selected);
          setAddedLicenseId(selected.id);
        }}
      >
        {addedLicenseId === selected.id ? "Added to Cart" : `Add to Cart - ${formatTHB(selected.priceThb)}`}
      </Button>
      {addedLicenseId ? (
        <div className="rounded-2xl border border-lime-300/30 bg-lime-300/10 p-3 text-sm text-lime-100">
          เพิ่ม {selected.name} ลงตะกร้าแล้ว ถ้าเลือก license ใหม่ของบีทนี้ ระบบจะอัปเดตรายการเดิมใน cart
          <div className="mt-3">
            <LinkButton href="/cart" variant="secondary">ไป Cart</LinkButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
