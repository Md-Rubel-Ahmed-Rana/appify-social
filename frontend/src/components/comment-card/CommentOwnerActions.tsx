import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { toast } from 'sonner';
import { useState } from 'react';
import { Comment } from '@/types/comment.type';
import EditCommentModal from './EditCommentModal';
import { useDeleteCommentMutation } from '@/api/comments';

type Props = {
  comment: Comment;
};

const CommentOwnerActions = ({ comment }: Props) => {
  const [isEdit, setIsEdit] = useState(false);

  const [deleteComment, { isLoading }] = useDeleteCommentMutation();

  const handleDeleteComment = async () => {
    try {
      const result = await deleteComment({ comment_id: comment.id }).unwrap();

      if (result.statusCode === 200) {
        toast.success(
          result.message || 'Comment has been deleted successfully',
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  return (
    <>
      {isEdit && (
        <EditCommentModal
          open={isEdit}
          setOpen={setIsEdit}
          comment_id={comment.id}
          content={comment.content}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-16">
          {comment.is_owner && (
            <>
              <DropdownMenuItem onClick={() => setIsEdit(true)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteComment}
                className="text-destructive focus:text-destructive"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 size-4" />
                {isLoading ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CommentOwnerActions;
