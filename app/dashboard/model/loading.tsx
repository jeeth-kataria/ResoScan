import { Skeleton } from "@/components/ui/skeleton";

export default function ModelLoading() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <Skeleton className="h-24 w-64" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0,1,2,3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        {[0,1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[0,1,2,3].map(i => <Skeleton key={i} className="h-56 w-full" />)}
      </div>
    </div>
  );
}
