import { Skeleton } from '@/components/ui/skeleton';

const ReplySkeleton = () => {
  return (
    <div className="mt-4 ml-6 border-l pl-4 space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplySkeleton;
