import { Button } from '@/components/ui/button';
import { Comment } from '@/types/comment.type';
import LikeUnlikeAction from '../likes/LikeUnlikeAction';
import { useState } from 'react';
import ReplyForm from '../replies/ReplyForm';

type Props = {
  comment: Comment;
};

const CommentActions = ({ comment }: Props) => {
  const [isReply, setIsReply] = useState(false);

  const handleCancel = () => {
    setIsReply(!isReply);
  };

  return (
    <>
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
          onClick={() => setIsReply(!isReply)}
        >
          Reply
        </Button>
      </div>
      {isReply && <ReplyForm comment_id={comment.id} onCancel={handleCancel} />}
    </>
  );
};

export default CommentActions;
