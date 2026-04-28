import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { EmptyState, ErrorState, SectionCard, StatCard, VerificationBadge } from "@/components/ui";
import { getCoachDashboardData } from "@/lib/adapters/coach";

export default async function CoachDashboardPage() {
  const data = await getCoachDashboardData();

  return (
    <PageLayout title="Welcome back, Coach" subtitle={`Last active ${data.lastActiveLabel}`} eyebrow="Coach Dashboard">
      {!data.verified ? (
        <div className="rounded-xl border border-amber-300/50 bg-amber-500/10 p-4 text-sm text-amber-100">
          Verification in progress. Complete your coach profile, upload organization proof, and submit your verification documents.
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} />)}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Recent searches">
          {data.recentSearches.length === 0 ? <EmptyState title="No recent searches" description="Your latest player searches will appear here." /> : (
            <div className="space-y-2">{data.recentSearches.map((search) => <div key={search.id} className="flex items-center justify-between rounded-md border border-white/10 bg-black/30 p-2"><div><p className="text-sm text-white">{search.query}</p><p className="text-xs text-white/60">{search.createdAt}</p></div><button className="rounded-md border border-white/20 px-2 py-1 text-xs text-white/80">Repeat search</button></div>)}</div>
          )}
        </SectionCard>

        <SectionCard title="Shortlist preview" footer={<Link href="/coach/shortlist" className="text-sm font-semibold text-[var(--brand-primary)]">View full shortlist</Link>}>
          {data.shortlistPreview.length === 0 ? <EmptyState title="No shortlisted players" description="Save prospects from Coach Search to build your shortlist." /> : (
            <div className="grid gap-2 sm:grid-cols-2">{data.shortlistPreview.map((player) => <article key={player.id} className="rounded-md border border-white/10 bg-black/30 p-3"><p className="text-sm font-semibold text-white">{player.name}</p><p className="text-xs text-white/60">{player.position} · {player.gradYear} · {player.state}</p></article>)}</div>
          )}
        </SectionCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Message activity">
          {data.messageActivity.length === 0 ? <ErrorState title="No activity" description="Message activity will appear when conversations begin." /> : (
            <div className="space-y-2">{data.messageActivity.map((item) => <article key={item.id} className="rounded-md border border-white/10 bg-black/30 p-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">{item.name}</p>{item.unread > 0 ? <span className="rounded-full bg-[var(--brand-primary)] px-2 py-0.5 text-[10px] text-white">{item.unread} unread</span> : <VerificationBadge state="verified" />}</div><p className="mt-1 text-xs text-white/70">{item.preview}</p></article>)}</div>
          )}
        </SectionCard>

        <SectionCard title="Suggested prospects">
          {data.suggestedProspects.length === 0 ? <EmptyState title="No suggestions yet" description="Add recruiting interests in your profile to improve suggestions." /> : (
            <div className="grid gap-2 sm:grid-cols-2">{data.suggestedProspects.map((player) => <article key={player.id} className="rounded-md border border-white/10 bg-black/30 p-3"><p className="text-sm font-semibold text-white">{player.name}</p><p className="text-xs text-white/60">{player.position} · {player.gradYear} · {player.state}</p><button className="mt-2 rounded-md bg-[var(--brand-primary)] px-2 py-1 text-xs font-semibold text-white">Shortlist</button></article>)}</div>
          )}
        </SectionCard>
      </section>
    </PageLayout>
  );
}
