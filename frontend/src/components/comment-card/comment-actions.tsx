import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Comment } from '@/types/comment.type';
import LikeUnlikeAction from '../post-card/LikeUnlikeAction';

type Props = {
  comment: Comment;
};

const CommentActions = ({ comment }: Props) => {
  return (
    <div className="mt-3 flex items-center gap-2">
      <LikeUnlikeAction
        liked={comment.is_liked}
        like_count={comment.like_count}
        target_id={comment.id}
        target_type="comment"
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1 px-2 text-muted-foreground"
      >
        <MessageCircle className="h-4 w-4" />

        {comment.reply_count > 0 && <span>{comment.reply_count}</span>}

        <span>Reply</span>
      </Button>
    </div>
  );
};

export default CommentActions;
