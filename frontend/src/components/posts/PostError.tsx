'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onRetry: () => void;
};

const PostError = ({ onRetry }: Props) => {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>

      <h2 className="text-xl font-semibold">Couldn&apos;t load your feed</h2>

      <p className="mt-2 text-muted-foreground">
        Something went wrong while loading the latest posts. Please try again.
      </p>

      <Button onClick={onRetry} className="mt-6 gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
};

export default PostError;
