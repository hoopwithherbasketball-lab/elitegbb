import PageLayout from "@/components/PageLayout";
import { EmptyState, SectionCard } from "@/components/ui";
import { ProfileEditorClient, type ProfileEditorValues } from "@/app/(member)/dashboard/_components/ProfileEditorClient";

const defaultProfileValues: ProfileEditorValues = {
  height: "5'10\"",
  weight: "155 lbs",
  wingspan: "6'1\"",
  school: "Northview High",
  gpaRange: "3.6 - 3.8",
  testRange: "SAT 1220",
  intendedMajor: "Sports Management",
  graduationYear: "2027",
  visibility: "members_only",
};

const highlights = [
  { id: "h1", label: "Junior Season Highlights", href: "https://example.com/highlights/junior" },
  { id: "h2", label: "Summer Showcase Clip", href: "https://example.com/highlights/summer" },
];

const endorsements = [
  { id: "e1", coach: "Coach Avery Lewis", org: "River City Prep", quote: "High IQ guard with strong leadership qualities." },
  { id: "e2", coach: "Coach Dana Mitchell", org: "Summit Hoops", quote: "Excellent work ethic and consistent progression." },
];

const seasonStats = [
  { label: "PPG", value: "15.8" },
  { label: "APG", value: "5.2" },
  { label: "RPG", value: "4.1" },
  { label: "FG%", value: "46%" },
];

export default function DashboardProfilePage() {
  return (
    <PageLayout title="Profile" subtitle="Manage your player profile, visibility, stats, and academics." eyebrow="Player Profile">
      <SectionCard title="Profile hero" description="Public-facing snapshot coaches see first.">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xl">🏀</div>
          <div>
            <p className="text-lg font-semibold text-white">Jordan Athlete</p>
            <p className="text-sm text-white/70">PG · 2027 · Atlanta, GA</p>
          </div>
          <button type="button" className="ml-auto rounded-md border border-white/20 px-3 py-2 text-sm text-white/80">Edit hero</button>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <SectionCard title="Player info + measurables" description="Update core profile fields, academics, and privacy settings.">
          <ProfileEditorClient initialValues={defaultProfileValues} />
        </SectionCard>

        <SectionCard title="Completion checklist" description="Keep this section updated for recruiting confidence.">
          <ul className="space-y-2 text-sm text-white/75">
            <li>✅ Basic profile details</li>
            <li>✅ Height, weight, wingspan</li>
            <li>⚪ Add one more highlight</li>
            <li>⚪ Confirm ACT score range</li>
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Highlights" description="Video and link cards for recent gameplay and workouts.">
        {highlights.length === 0 ? <EmptyState title="No highlights yet" description="Add links to Hudl, YouTube, or game film." /> : (
          <div className="grid gap-3 md:grid-cols-2">
            {highlights.map((item) => (
              <article key={item.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <a href={item.href} className="mt-1 block text-xs text-[var(--brand-primary)]" target="_blank" rel="noreferrer">Open link</a>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Season stats" description="Editable seasonal stats summary.">
          <div className="grid grid-cols-2 gap-3">
            {seasonStats.map((item) => (
              <div key={item.label} className="rounded-md border border-white/10 bg-black/30 p-3">
                <p className="text-xs text-white/60">{item.label}</p>
                <p className="text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Coach endorsements" description="Credibility signals from verified coaches.">
          {endorsements.length === 0 ? <EmptyState title="No endorsements yet" description="Coach endorsements will appear when available." /> : (
            <div className="space-y-3">
              {endorsements.map((item) => (
                <article key={item.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-sm font-semibold text-white">{item.coach} · {item.org}</p>
                  <p className="mt-1 text-sm text-white/70">“{item.quote}”</p>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </section>
    </PageLayout>
  );
}
