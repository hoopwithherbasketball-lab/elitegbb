import { SkeletonCard } from "@/components/ui";

export default function CoachDashboardLoading() {
  return <main className="mx-auto w-full max-w-6xl"><SkeletonCard rows={4} columns={4} /></main>;
}
