import PageLayout from "@/components/PageLayout";
import { EmptyState, SectionCard } from "@/components/ui";
import { getTrainingDashboardData } from "@/lib/adapters/training";
import { TrainingClient } from "@/app/(member)/dashboard/_components/TrainingClient";

export default async function DashboardTrainingPage() {
  const data = await getTrainingDashboardData();

  return (
    <PageLayout title="Training" subtitle="Explore programs, drills, and continue from where you left off." eyebrow="Training Hub">
      <SectionCard title={data.featuredProgram.title} description={data.featuredProgram.description}>
        <div className="space-y-3">
          <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: `${data.featuredProgram.progressPercent}%` }} /></div>
          <p className="text-sm text-white/80">{data.featuredProgram.progressPercent}% complete</p>
          <button type="button" className="rounded-md bg-[var(--brand-primary)] px-3 py-2 text-sm font-semibold text-white">Continue</button>
        </div>
      </SectionCard>

      {data.videos.length === 0 ? (
        <EmptyState title="No training content available" description="Training content will appear when published." />
      ) : (
        <TrainingClient data={data} />
      )}

      <SectionCard title="Drill library" description="Quick-access drills by category and equipment.">
        {data.drills.length === 0 ? <EmptyState title="No drills available" description="Add drills to build your training library." /> : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.drills.map((drill) => (
              <article key={drill.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="text-sm font-semibold text-white">{drill.icon} {drill.title}</p>
                <p className="mt-1 text-xs text-white/70">{drill.category} · Equipment: {drill.equipment}</p>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Continue watching" description="Your latest items.">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {data.videos.slice(0, 4).map((video) => (
            <article key={video.id} className="min-w-[220px] rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-sm font-semibold text-white">{video.title}</p>
              <p className="mt-1 text-xs text-white/70">{video.progressPercent}% complete</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </PageLayout>
  );
}
