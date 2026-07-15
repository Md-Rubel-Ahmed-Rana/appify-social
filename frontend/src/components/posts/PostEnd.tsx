import { Check } from 'lucide-react';

const PostEnd = () => {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-px flex-1 bg-border" />

      <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
        <Check className="size-4 text-green-600" />
        <span>You&apos;re all caught up</span>
      </div>

      <div className="h-px flex-1 bg-border" />
    </div>
  );
};

export default PostEnd;
