import { Card, Skeleton } from "@/components/ui";

export function DashboardSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading dashboard" className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="space-y-5 p-5 sm:p-6">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.85fr)]">
        <Card className="space-y-5 p-5 sm:p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </Card>
        <Card className="space-y-4 p-5 sm:p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </Card>
      </div>
    </main>
  );
}
