import { MessageCircle } from 'lucide-react';

const EmptyComments = () => (
  <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
    <MessageCircle className="mb-4 h-10 w-10 text-muted-foreground" />

    <h3 className="text-lg font-semibold">No comments yet</h3>

    <p className="mt-2 text-sm text-muted-foreground">
      Be the first person to comment on this post.
    </p>
  </div>
);

export default EmptyComments;
