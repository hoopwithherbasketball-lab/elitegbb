import { SkeletonCard } from "@/components/ui";

export default function DashboardTrainingLoading() {
  return <main className="mx-auto w-full max-w-6xl"><SkeletonCard rows={5} columns={3} /></main>;
}
