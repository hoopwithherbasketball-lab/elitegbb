"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState, StatusBadge } from "@/components/ui";

interface ShortlistPlayer {
  id: string;
  player_name: string;
  grad_class: string | null;
  primary_position: string | null;
  state: string | null;
  verified: boolean | null;
}

type ShortlistStatus = "Interested" | "Priority" | "Contacted" | "Pass";

interface ShortlistManagerClientProps {
  players: ShortlistPlayer[];
}

export function ShortlistManagerClient({ players }: ShortlistManagerClientProps) {
  const [statusById, setStatusById] = useState<Record<string, ShortlistStatus>>({});
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [filterStatus, setFilterStatus] = useState<"all" | ShortlistStatus>("all");
  const [sortKey, setSortKey] = useState<"player" | "grad" | "position" | "state">("player");

  const filtered = useMemo(() => {
    const withStatus = players.filter((player) => filterStatus === "all" || statusById[player.id] === filterStatus);
    return [...withStatus].sort((a, b) => {
      if (sortKey === "grad") return (a.grad_class ?? "").localeCompare(b.grad_class ?? "");
      if (sortKey === "position") return (a.primary_position ?? "").localeCompare(b.primary_position ?? "");
      if (sortKey === "state") return (a.state ?? "").localeCompare(b.state ?? "");
      return a.player_name.localeCompare(b.player_name);
    });
  }, [players, filterStatus, sortKey, statusById]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[var(--surface)] p-3">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as "all" | ShortlistStatus)} className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white">
          <option value="all">All status</option>
          <option value="Interested">Interested</option>
          <option value="Priority">Priority</option>
          <option value="Contacted">Contacted</option>
          <option value="Pass">Pass</option>
        </select>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as "player" | "grad" | "position" | "state")} className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white">
          <option value="player">Sort: Player</option>
          <option value="grad">Sort: Grad Year</option>
          <option value="position">Sort: Position</option>
          <option value="state">Sort: State</option>
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState title="Your shortlist is empty. Start searching for prospects." description="Use Coach Search to add players to your shortlist." /> : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-white/10 lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/30 text-xs text-white/60"><tr><th className="px-3 py-2">Player</th><th>Position</th><th>Grad</th><th>Location</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((player) => (
                  <tr key={player.id} className="border-t border-white/10">
                    <td className="px-3 py-2 text-white">{player.player_name}</td><td>{player.primary_position ?? "-"}</td><td>{player.grad_class ?? "-"}</td><td>{player.state ?? "-"}</td>
                    <td>
                      <select value={statusById[player.id] ?? "Interested"} onChange={(e) => setStatusById((prev) => ({ ...prev, [player.id]: e.target.value as ShortlistStatus }))} className="rounded border border-white/20 bg-black/40 px-2 py-1 text-xs text-white">
                        <option>Interested</option><option>Priority</option><option>Contacted</option><option>Pass</option>
                      </select>
                    </td>
                    <td><input value={notesById[player.id] ?? ""} onChange={(e) => setNotesById((prev) => ({ ...prev, [player.id]: e.target.value }))} onBlur={() => undefined} className="w-full rounded border border-white/20 bg-black/40 px-2 py-1 text-xs text-white" placeholder="Add notes" /></td>
                    <td className="space-x-2"><Link href="/browse" className="text-xs text-[var(--brand-primary)]">View</Link><button className="text-xs text-white/80">Message</button><button className="text-xs text-white/70">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {filtered.map((player) => (
              <article key={player.id} className="rounded-xl border border-white/10 bg-[var(--surface)] p-4">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">{player.player_name}</p><StatusBadge variant={player.verified ? "active" : "pending"} /></div>
                <p className="mt-1 text-xs text-white/70">{player.primary_position ?? "-"} · {player.grad_class ?? "-"} · {player.state ?? "-"}</p>
                <div className="mt-3 flex gap-2"><button className="rounded-md border border-white/20 px-2 py-1 text-xs text-white/80">Message</button><button className="rounded-md border border-white/20 px-2 py-1 text-xs text-white/70">Remove</button></div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
