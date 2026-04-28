import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { SectionCard, VerificationBadge } from "@/components/ui";
import { CoachProfileEditorClient } from "@/app/(coach)/coach/_components/CoachProfileEditorClient";

const initialValues = {
  title: "Assistant Coach",
  organization: "Metro Academy",
  division: "AAU 17U",
  location: "Atlanta, GA",
  website: "https://example.com",
  responseTime: "Within 24 hours",
  preferredContact: "Platform messaging",
};

export default function CoachProfilePage() {
  return (
    <PageLayout title="Coach Profile" subtitle="Keep organization details and recruiting criteria up to date." eyebrow="Coach Account">
      <SectionCard title="Profile header" description="Verification and core profile info.">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-muted)] text-white">CA</div>
          <div><p className="text-lg font-semibold text-white">Coach Alex</p><p className="text-sm text-white/70">Assistant Coach · Metro Academy</p></div>
          <VerificationBadge state="pending" className="ml-auto" />
        </div>
      </SectionCard>

      <SectionCard title="Organization, recruiting interests, and communication preferences">
        <CoachProfileEditorClient initialValues={initialValues} />
      </SectionCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Verification status" description="Current status, submitted documents, and next steps.">
          <ul className="space-y-2 text-sm text-white/75"><li>Current state: Pending review</li><li>Documents submitted: Organization letter, ID verification</li><li>Next step: Complete compliance questionnaire</li></ul>
        </SectionCard>
        <SectionCard title="Account settings" description="Manage billing and membership settings.">
          <Link href="/billing" className="inline-flex rounded-md bg-[var(--brand-primary)] px-3 py-2 text-sm font-semibold text-white">Go to Billing</Link>
        </SectionCard>
      </section>
    </PageLayout>
  );
}
