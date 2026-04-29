import type { Beat } from "@/types";
import { BeatCard } from "./beat-card";

type BeatGridProps = {
  beats: Beat[];
};

export function BeatGrid({ beats }: BeatGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {beats.map((beat) => (
        <BeatCard key={beat.id} beat={beat} queue={beats} />
      ))}
    </div>
  );
}
