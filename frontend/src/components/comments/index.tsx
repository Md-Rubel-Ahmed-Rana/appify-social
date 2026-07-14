'use client';

import { useGetCommentsByPostQuery } from '@/api/comments';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Comment } from '@/types/comment.type';
import CommentsList from './CommentsList';
import EmptyComments from './EmptyComments';
import CommentsError from './CommentsError';
import CommentsSkeleton from './CommentsSkeleton';
import CreateComment from '../create-comment';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  post_id: string;
};

const CommentsDrawer = ({ open, setOpen, post_id }: Props) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCommentsByPostQuery(
      {
        next_cursor: '',
        postId: post_id,
      },
      {
        skip: !open,
      },
    );

  const comments = (data?.data?.comments ?? []) as Comment[];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="min-h-0 mx-auto flex w-full max-w-2xl  flex-col rounded-t-3xl shadow-2xl">
        <DrawerHeader className="sticky top-0 z-10  border-b bg-background">
          <DrawerTitle className="text-center font-semibold text-xl">
            Comments
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading || isFetching ? (
            <CommentsSkeleton />
          ) : isError ? (
            <CommentsError onRetry={refetch} />
          ) : comments.length === 0 ? (
            <EmptyComments />
          ) : (
            <CommentsList comments={comments} />
          )}
        </div>
        <DrawerFooter className="border-t bg-background p-2">
          <CreateComment post_id={post_id} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentsDrawer;
