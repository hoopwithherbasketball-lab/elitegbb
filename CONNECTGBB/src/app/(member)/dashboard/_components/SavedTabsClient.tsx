"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/ui";

interface SavedItem {
  id: string;
  title: string;
  href: string;
}

interface SavedTabsClientProps {
  players: SavedItem[];
  training: SavedItem[];
  events: SavedItem[];
}

export function SavedTabsClient({ players, training, events }: SavedTabsClientProps) {
  const [tab, setTab] = useState<"players" | "training" | "events">("players");
  const items = tab === "players" ? players : tab === "training" ? training : events;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {([
          { id: "players", label: "Players" },
          { id: "training", label: "Training" },
          { id: "events", label: "Events" },
        ] as const).map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-full px-3 py-1.5 text-sm ${tab === item.id ? "bg-[var(--brand-primary)] text-white" : "border border-white/20 text-white/80"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState title={`No saved ${tab}`} description="Use the bookmark actions across the platform to save items here." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-[var(--surface)] p-4">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <div className="mt-3 flex gap-2">
                <Link href={item.href} className="rounded-md bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white">Open</Link>
                <button type="button" className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white/80">Unsave</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
