import { SkeletonCard } from "@/components/ui";

export default function DashboardProfileLoading() {
  return <main className="mx-auto w-full max-w-6xl"><SkeletonCard rows={6} columns={2} /></main>;
}
