'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLikeMutation, useUnlikeMutation } from '@/api/likes';
import { useState } from 'react';
import LikersModal from './LikersModal';

type Props = {
  target_id: string;
  liked: boolean;
  like_count: number;
  target_type: 'post' | 'comment' | 'reply';
};

const LikeUnlikeAction = ({
  target_id,
  liked,
  like_count,
  target_type,
}: Props) => {
  const [like, { isLoading: isLiking }] = useLikeMutation();
  const [unlike, { isLoading: isUnliking }] = useUnlikeMutation();
  const [showLikers, setShowLikers] = useState(false);

  const isLoading = isLiking || isUnliking;

  const handleToggleLike = async () => {
    if (isLoading) return;

    try {
      if (liked) {
        await unlike({ target_id, target_type }).unwrap();
      } else {
        await like({ target_id, target_type }).unwrap();
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLoading}
          className="flex items-center"
          title={liked ? 'Withdraw your like' : `Like to this ${target_type}`}
        >
          <Heart
            className={`h-4 w-4 transition-colors cursor-pointer ${
              liked ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => setShowLikers(true)}
          disabled={like_count === 0}
          className="text-sm text-muted-foreground cursor-pointer hover:text-foreground disabled:pointer-events-none disabled:opacity-60"
          title={`Show who like(s) on this ${target_type}`}
        >
          {like_count} {like_count === 1 ? 'Like' : 'Likes'}
        </button>
      </div>

      {showLikers && (
        <LikersModal
          open={showLikers}
          setOpen={setShowLikers}
          target_id={target_id}
          target_type={target_type}
        />
      )}
    </>
  );
};

export default LikeUnlikeAction;
