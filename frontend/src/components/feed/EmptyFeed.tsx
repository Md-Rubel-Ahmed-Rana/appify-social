import { FileText } from 'lucide-react';

const EmptyFeed = () => {
  return (
    <div className="rounded-xl border bg-card p-12 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold">No posts yet</h2>

      <p className="mt-2 max-w-md mx-auto text-muted-foreground">
        Be the first person to share something with the community. Your post
        will appear here.
      </p>
    </div>
  );
};

export default EmptyFeed;
