import { MessageCircleMore } from 'lucide-react';

const EmptyReplies = () => {
  return (
    <div className="mt-4 ml-6 flex items-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
      <MessageCircleMore className="h-4 w-4" />

      <span>No replies yet.</span>
    </div>
  );
};

export default EmptyReplies;
