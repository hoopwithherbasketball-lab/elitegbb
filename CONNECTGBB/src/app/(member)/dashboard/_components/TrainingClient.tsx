"use client";

import { useMemo, useState } from "react";
import { EmptyState, FilterBar, SectionCard } from "@/components/ui";
import type { TrainingCategory, TrainingDashboardData, TrainingLevel } from "@/lib/adapters/training";

interface TrainingClientProps {
  data: TrainingDashboardData;
}

export function TrainingClient({ data }: TrainingClientProps) {
  const [category, setCategory] = useState<TrainingCategory>("All");
  const [level, setLevel] = useState<"all" | TrainingLevel>("all");
  const [completion, setCompletion] = useState<"all" | "completed" | "incomplete">("all");
  const [maxDuration, setMaxDuration] = useState<number>(30);

  const filteredVideos = useMemo(() => data.videos.filter((video) => {
    if (category !== "All" && video.category !== category) return false;
    if (level !== "all" && video.difficulty !== level) return false;
    if (completion === "completed" && !video.completed) return false;
    if (completion === "incomplete" && video.completed) return false;
    return video.durationMinutes <= maxDuration;
  }), [category, level, completion, maxDuration, data.videos]);

  const activeFilters = [
    category !== "All" ? { id: "category", label: `Category: ${category}` } : null,
    level !== "all" ? { id: "level", label: `Level: ${level}` } : null,
    completion !== "all" ? { id: "completion", label: `Completion: ${completion}` } : null,
    maxDuration !== 30 ? { id: "duration", label: `Max duration: ${maxDuration}m` } : null,
  ].filter((item): item is { id: string; label: string } => Boolean(item));

  const clearFilter = (id: string) => {
    if (id === "category") setCategory("All");
    if (id === "level") setLevel("all");
    if (id === "completion") setCompletion("all");
    if (id === "duration") setMaxDuration(30);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["All", "Ball Handling", "Shooting", "Defense", "Conditioning", "Recruiting Ed"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-3 py-1.5 text-sm ${category === item ? "bg-[var(--brand-primary)] text-white" : "border border-white/20 text-white/80"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <SectionCard title="Filter training" description="Filter by level, duration, and completion state.">
        <div className="grid gap-3 md:grid-cols-3">
          <select value={level} onChange={(event) => setLevel(event.target.value as "all" | TrainingLevel)} className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white">
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select value={completion} onChange={(event) => setCompletion(event.target.value as "all" | "completed" | "incomplete")} className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white">
            <option value="all">Completed + not completed</option>
            <option value="completed">Completed only</option>
            <option value="incomplete">Not completed</option>
          </select>
          <input type="number" min={5} max={60} value={maxDuration} onChange={(event) => setMaxDuration(Number(event.target.value))} className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
        </div>
        <FilterBar filters={activeFilters} onRemove={clearFilter} onClearAll={() => {
          setCategory("All"); setLevel("all"); setCompletion("all"); setMaxDuration(30);
        }} className="mt-4" />
      </SectionCard>

      {filteredVideos.length === 0 ? (
        <EmptyState title="No training matches" description="Try widening your filters to find more videos." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <article key={video.id} className="rounded-xl border border-white/10 bg-[var(--surface)] p-4">
              <div className="text-2xl">{video.thumbnail}</div>
              <h3 className="mt-2 text-sm font-semibold text-white">{video.title}</h3>
              <p className="mt-1 text-xs text-white/70">{video.durationMinutes} min · {video.difficulty} · {video.category}</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: `${video.progressPercent}%` }} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
