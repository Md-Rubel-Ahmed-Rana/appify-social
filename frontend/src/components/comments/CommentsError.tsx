import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorProps = {
  onRetry: () => void;
};

const CommentsError = ({ onRetry }: ErrorProps) => (
  <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
    <AlertCircle className="mb-4 h-10 w-10 text-destructive" />

    <h3 className="text-lg font-semibold">Failed to load comments</h3>

    <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>

    <Button className="mt-5" onClick={onRetry}>
      Retry
    </Button>
  </div>
);

export default CommentsError;
