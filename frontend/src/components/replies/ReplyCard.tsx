import { formatDistanceToNowStrict } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Reply } from '@/types/reply.type';

import LikeUnlikeAction from '../likes/LikeUnlikeAction';
import { Button } from '@/components/ui/button';
import ReplyForm from './ReplyForm';
import ReplyOwnerActions from './ReplyOwnerActions';

type Props = {
  reply: Reply;
  comment_id: string;
  repliesByParent: Map<string | null, Reply[]>;
  replyingTo: Reply | null;
  setReplyingTo: (value: Reply | null) => void;
};

const ReplyCard = ({
  reply,
  repliesByParent,
  replyingTo,
  setReplyingTo,
  comment_id,
}: Props) => {
  const children = repliesByParent.get(reply.id) ?? [];

  const initials = reply.author.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2);

  const handleCancel = () => {
    setReplyingTo(null);
  };

  return (
    <div className="space-y-3">
      <article className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={reply.author.avatar_url} alt={reply.author.name} />

          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="font-semibold text-foreground">
                {reply.author.name}
              </span>

              {reply.reply_to_user && (
                <>
                  <span className="text-muted-foreground">replied to</span>

                  <span className="font-medium text-primary">
                    {reply.reply_to_user.name}
                  </span>
                </>
              )}

              <span className="text-muted-foreground">•</span>

              <span className="text-muted-foreground">
                {formatDistanceToNowStrict(new Date(reply.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {reply.is_owner && <ReplyOwnerActions reply={reply} />}
          </div>

          <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6">
            {reply.content}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <LikeUnlikeAction
              liked={reply.is_liked}
              like_count={reply.like_count}
              target_id={reply.id}
              target_type="reply"
            />

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={() => setReplyingTo(reply)}
            >
              Reply
            </Button>
          </div>

          {replyingTo?.id === reply.id && (
            <ReplyForm
              reply={reply}
              comment_id={comment_id}
              onCancel={handleCancel}
            />
          )}
        </div>
      </article>

      {children.length > 0 && (
        <div className="ml-5 border-l border-border pl-5 space-y-4">
          {children.map((child) => (
            <ReplyCard
              key={child.id}
              reply={child}
              repliesByParent={repliesByParent}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              comment_id={comment_id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyCard;
