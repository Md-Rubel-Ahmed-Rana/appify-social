'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLikeMutation, useUnlikeMutation } from '@/api/likes';

type Props = {
  target_id: string;
  liked: boolean;
  like_count: number;
};

const LikeUnlikeAction = ({ target_id, liked, like_count }: Props) => {
  const [like, { isLoading: isLiking }] = useLikeMutation();
  const [unlike, { isLoading: isUnliking }] = useUnlikeMutation();

  const isLoading = isLiking || isUnliking;

  const handleToggleLike = async () => {
    if (isLoading) return;

    try {
      if (liked) {
        await unlike({ target_id, target_type: 'post' }).unwrap();
      } else {
        await like({ target_id, target_type: 'post' }).unwrap();
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong.');
    }
  };

  return (
    <Button
      variant="ghost"
      className="gap-2"
      onClick={handleToggleLike}
      disabled={isLoading}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          liked ? 'fill-red-500 text-red-500' : ''
        }`}
      />

      <span>{like_count}</span>

      <span>{liked ? 'Liked' : 'Like'}</span>
    </Button>
  );
};

export default LikeUnlikeAction;
