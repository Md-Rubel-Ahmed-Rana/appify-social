'use client';

import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

type Props = {
  liked: boolean;
  like_count: number;
  comment_count: number;
};

const PostActions = ({ liked, comment_count, like_count }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button variant="ghost" className="gap-2">
        <Heart
          className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`}
        />
        <span> {like_count}</span>
        <span>Like</span>
      </Button>

      <Button variant="ghost" className="gap-2">
        <MessageCircle className="h-4 w-4" />
        <span>{comment_count}</span>
        <span>Comment</span>
      </Button>

      <Button variant="ghost" className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default PostActions;
