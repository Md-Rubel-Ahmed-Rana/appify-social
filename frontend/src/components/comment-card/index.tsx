import { formatDistanceToNowStrict } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/types/comment.type';
import CommentActions from './comment-actions';
import { useState } from 'react';
import Replies from '../replies';

type Props = {
  comment: Comment;
};

const CommentCard = ({ comment }: Props) => {
  const [showReplies, setShowReplies] = useState(false);
  const authorName = `${comment.author.first_name} ${comment.author.last_name}`;
  const initials = `${comment.author.first_name.charAt(0)}${comment.author.last_name.charAt(0)}`;

  return (
    <article className="flex gap-3 p-4 transition-colors hover:bg-muted/30">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={comment.author.avatar_url} alt={authorName} />

        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="truncate text-sm font-semibold">{authorName}</h4>

          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDistanceToNowStrict(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>

        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground">
          {comment.content}
        </p>

        <CommentActions comment={comment} />
        {showReplies && <Replies comment_id={comment?.id} />}

        {comment.reply_count > 0 && (
          <Button variant="link" onClick={() => setShowReplies(!showReplies)}>
            {showReplies
              ? 'Hide replies'
              : `View ${comment.reply_count} ${
                  comment.reply_count === 1 ? 'reply' : 'replies'
                }`}
          </Button>
        )}
      </div>
    </article>
  );
};

export default CommentCard;
