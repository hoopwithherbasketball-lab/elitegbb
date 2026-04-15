import { SkeletonCard } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
      <SkeletonCard rows={3} />
      <SkeletonCard rows={4} columns={2} />
      <SkeletonCard rows={3} columns={4} />
    </main>
  );
}
