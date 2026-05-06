import { Skeleton } from "@/components/ui/skeleton";

const DirectoryCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden border bg-card">
    <Skeleton className="aspect-[16/10] w-full" />
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

export default DirectoryCardSkeleton;
