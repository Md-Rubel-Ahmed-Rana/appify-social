import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { Post } from '@/types/post.type';
import { useDeletePostMutation } from '@/api/posts';
import { toast } from 'sonner';
import { useState } from 'react';
import EditPostModal from './EditPostModal';

type Props = {
  post: Post;
};

const PostOwnerActions = ({ post }: Props) => {
  const [isEdit, setIsEdit] = useState(false);

  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleDeletePost = async () => {
    try {
      const result = await deletePost({ post_id: post.id }).unwrap();

      if (result.statusCode === 200) {
        toast.success(result.message || 'Post has been deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post');
    }
  };

  return (
    <>
      {isEdit && (
        <EditPostModal
          open={isEdit}
          setOpen={setIsEdit}
          post_id={post.id}
          content={post.content}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {post.is_owner && (
            <>
              <DropdownMenuItem onClick={() => setIsEdit(true)}>
                <Pencil className="mr-2 size-4" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeletePost}
                className="text-destructive focus:text-destructive"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 size-4" />
                {isLoading ? 'Deleting...' : 'Delete Post'}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostOwnerActions;
