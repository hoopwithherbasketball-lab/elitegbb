import { SkeletonCard } from "@/components/ui";

export default function CoachProfileLoading() {
  return <main className="mx-auto w-full max-w-6xl"><SkeletonCard rows={6} columns={2} /></main>;
}
