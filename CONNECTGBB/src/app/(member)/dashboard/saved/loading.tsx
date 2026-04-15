import { SkeletonCard } from "@/components/ui";

export default function DashboardSavedLoading() {
  return <main className="mx-auto w-full max-w-6xl"><SkeletonCard rows={5} columns={2} /></main>;
}
