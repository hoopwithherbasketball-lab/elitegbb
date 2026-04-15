import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { EmptyState, ErrorState, SectionCard, StatCard } from "@/components/ui";
import { getMemberDashboardData } from "@/lib/adapters/memberDashboard";

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());
}

export default async function DashboardPage() {
  const dashboard = await getMemberDashboardData();

  return (
    <PageLayout title="Good morning, Athlete" subtitle={getTodayLabel()} eyebrow="Dashboard">
      <SectionCard title="Profile completion" description="Complete the checklist to improve recruiting visibility.">
        {dashboard.profileCompletion.percent <= 0 ? (
          <EmptyState title="No profile progress yet" description="Start your profile to unlock recommendations." />
        ) : (
          <div className="space-y-3">
            <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: `${dashboard.profileCompletion.percent}%` }} /></div>
            <p className="text-sm text-white/80">{dashboard.profileCompletion.percent}% complete</p>
            <ul className="space-y-1 text-sm text-white/70">
              {dashboard.profileCompletion.missingFields.map((field) => <li key={field}>• {field}</li>)}
            </ul>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Continue watching" description="Jump back into your latest training item.">
        {!dashboard.continueWatching ? (
          <EmptyState title="No training in progress" description="Start a lesson from Training to track progress here." />
        ) : (
          <div className="space-y-3">
            <p className="text-2xl">{dashboard.continueWatching.thumbnail}</p>
            <p className="text-sm font-semibold text-white">{dashboard.continueWatching.title}</p>
            <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: `${dashboard.continueWatching.progressPercent}%` }} /></div>
            <button type="button" className="rounded-md bg-[var(--brand-primary)] px-3 py-2 text-sm font-semibold text-white">Resume</button>
          </div>
        )}
      </SectionCard>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dashboard.stats.map((stat) => <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} />)}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Recent connections" footer={<Link href="/dashboard/connections" className="text-sm font-semibold text-[var(--brand-primary)]">View all</Link>}>
          {dashboard.recentConnections.length === 0 ? (
            <EmptyState title="No recent connections" description="Coach messages and requests will appear here." />
          ) : (
            <div className="space-y-3">
              {dashboard.recentConnections.map((item) => (
                <article key={item.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-sm font-semibold text-white">{item.name} · {item.organization}</p>
                  <p className="mt-1 text-xs text-white/70">{item.messagePreview}</p>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Upcoming events" footer={<Link href="/events" className="text-sm font-semibold text-[var(--brand-primary)]">View all</Link>}>
          {dashboard.upcomingEvents.length === 0 ? (
            <EmptyState title="No events scheduled" description="Check back soon for showcases and webinars." />
          ) : (
            <div className="space-y-3">
              {dashboard.upcomingEvents.map((event) => (
                <article key={event.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-sm font-semibold text-white">{event.name}</p>
                  <p className="mt-1 text-xs text-white/70">{event.date} · {event.location}</p>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </section>

      <SectionCard title="Recommended training" description="Suggested lessons based on your level and profile.">
        {dashboard.recommendedTraining.length === 0 ? (
          <ErrorState title="Recommendations unavailable" description="We could not load recommendations right now." />
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {dashboard.recommendedTraining.map((item) => (
              <article key={item.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-white/70">{item.category} · {item.level}</p>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </PageLayout>
  );
}
