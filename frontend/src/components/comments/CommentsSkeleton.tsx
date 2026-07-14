import { Skeleton } from '@/components/ui/skeleton';

const CommentsSkeleton = () => (
  <div className="space-y-6 p-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export default CommentsSkeleton;
