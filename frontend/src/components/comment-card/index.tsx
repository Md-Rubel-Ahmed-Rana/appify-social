import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Comment } from '@/types/comment.type';

type Props = {
  comment: Comment;
};

const CommentCard = ({ comment }: Props) => {
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

        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-muted-foreground"
          >
            <Heart
              className={`h-4 w-4 ${
                comment.is_liked ? 'fill-red-500 text-red-500' : ''
              }`}
            />

            {comment.like_count > 0 && <span>{comment.like_count}</span>}

            <span>Like</span>
          </Button>

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
      </div>
    </article>
  );
};

export default CommentCard;
