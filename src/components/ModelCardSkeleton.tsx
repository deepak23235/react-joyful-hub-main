import { Skeleton } from "@/components/ui/skeleton";

export const ModelCardSkeleton = () => {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
};
