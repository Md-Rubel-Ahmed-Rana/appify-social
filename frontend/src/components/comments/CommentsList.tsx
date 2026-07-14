import { Comment } from '@/types/comment.type';
import CommentCard from '../comment-card';

type Props = {
  comments: Comment[];
};

const CommentsList = ({ comments }: Props) => {
  return (
    <div className="flex w-full flex-col divide-y">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentsList;
