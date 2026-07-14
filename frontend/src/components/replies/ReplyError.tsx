import { Button } from '@/components/ui/button';

type Props = {
  onRetry: () => void;
};

const ReplyError = ({ onRetry }: Props) => {
  return (
    <div className="mt-4 ml-6 rounded-md border border-destructive/20 bg-destructive/5 p-4">
      <p className="text-sm text-destructive">Failed to load replies.</p>

      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
};

export default ReplyError;
