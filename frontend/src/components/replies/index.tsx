import { useMemo, useState } from 'react';

import { useGetRepliesQuery } from '@/api/replies';

import { Reply } from '@/types/reply.type';

import ReplyCard from './ReplyCard';
import ReplySkeleton from './ReplySkeleton';
import ReplyError from './ReplyError';
import EmptyReplies from './EmptyReplies';

type Props = {
  comment_id: string;
};

const Replies = ({ comment_id }: Props) => {
  const [replyingTo, setReplyingTo] = useState<Reply | null>(null);
  const { data, isLoading, isFetching, isError, refetch } = useGetRepliesQuery({
    comment_id,
  });

  const replies = (data?.data?.replies ?? []) as Reply[];

  const repliesByParent = useMemo(() => {
    const map = new Map<string | null, Reply[]>();

    for (const reply of replies) {
      const key = reply.parent_reply_id ?? null;

      const children = map.get(key) ?? [];

      children.push(reply);

      map.set(key, children);
    }

    return map;
  }, [replies]);

  const rootReplies = repliesByParent.get(null) ?? [];

  if (isLoading || isFetching) {
    return <ReplySkeleton />;
  }

  if (isError) {
    return <ReplyError onRetry={refetch} />;
  }

  if (!replies.length) {
    return <EmptyReplies />;
  }

  return (
    <div className="mt-4 space-y-4 border-l pl-4">
      {rootReplies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          repliesByParent={repliesByParent}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          comment_id={comment_id}
        />
      ))}
    </div>
  );
};

export default Replies;
