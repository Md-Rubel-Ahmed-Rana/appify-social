'use client';
import { Button } from '@/components/ui/button';
import { MessageCircle, Share2 } from 'lucide-react';
import LikeUnlikeAction from '../likes/LikeUnlikeAction';
import { useState } from 'react';
import CommentsDrawer from '../comments';

type Props = {
  liked: boolean;
  like_count: number;
  comment_count: number;
  post_id: string;
};

const PostActions = ({ liked, comment_count, like_count, post_id }: Props) => {
  const [showComments, setShowComments] = useState(false);
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <LikeUnlikeAction
          liked={liked}
          like_count={like_count}
          target_id={post_id}
          target_type="post"
        />

        <Button
          onClick={() => setShowComments(true)}
          variant="ghost"
          className="gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{comment_count}</span>
          <span>Comment</span>
        </Button>

        <Button variant="ghost" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
      {showComments && (
        <CommentsDrawer
          open={showComments}
          setOpen={setShowComments}
          post_id={post_id}
        />
      )}
    </>
  );
};

export default PostActions;
