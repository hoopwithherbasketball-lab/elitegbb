import PageLayout from "@/components/PageLayout";
import { EmptyState, SectionCard, StatCard } from "@/components/ui";

const summary = [
  { label: "Lessons Completed", value: "38", delta: "+4 this week" },
  { label: "Drills Done", value: "112", delta: "+9 this week" },
  { label: "Hours Logged", value: "41", delta: "+2.5 this week" },
  { label: "Streak", value: "12 days", delta: "Best: 18 days" },
];

const milestones = [
  { label: "Starter", unlocked: true },
  { label: "Film Room", unlocked: true },
  { label: "Recruiting Ready", unlocked: false },
  { label: "All-Access", unlocked: false },
];

const activity = [
  "2026-04-14 · Completed Defensive Angles module",
  "2026-04-13 · Finished 5 Spot Shooting drill",
  "2026-04-12 · Logged recruiting education lesson",
];

const goals = [
  { label: "Complete 3 shooting lessons", progress: 67 },
  { label: "Upload one new highlight", progress: 30 },
  { label: "Reach 15-day streak", progress: 80 },
];

const keepGoing = ["Closeout Footwork Circuit", "Transition Decision-Making", "Emailing Coaches 101"];

export default function DashboardProgressPage() {
  return (
    <PageLayout title="Progress" subtitle="Track activity, milestones, and weekly momentum." eyebrow="Performance">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} />)}
      </section>

      <SectionCard title="Weekly activity" description="Chart-ready data will display as volume grows.">
        <EmptyState title="Chart coming soon" description="Complete more sessions to enable a richer weekly chart." />
      </SectionCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Milestones" description="Badge-style achievements with locked and unlocked states.">
          <div className="grid gap-2 sm:grid-cols-2">
            {milestones.map((item) => (
              <div key={item.label} className="rounded-md border border-white/10 bg-black/30 p-3 text-sm text-white/80">
                {item.unlocked ? "🏅" : "🔒"} {item.label}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent activity feed" description="Latest completed lessons and drills.">
          <ul className="space-y-2 text-sm text-white/75">
            {activity.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </SectionCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Goals" description="Current goals with progress indicators.">
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.label}>
                <p className="text-sm text-white/80">{goal.label}</p>
                <div className="mt-1 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: `${goal.progress}%` }} /></div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Keep going" description="Recommended next training items.">
          <ul className="space-y-2 text-sm text-white/75">
            {keepGoing.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </SectionCard>
      </section>
    </PageLayout>
  );
}
