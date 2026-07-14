/* eslint-disable react-hooks/incompatible-library */
'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, SendHorizonal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAddNewCommentMutation } from '@/api/comments';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty.')
    .max(5000, 'Comment cannot exceed 5000 characters.'),
});

type FormValues = z.infer<typeof createCommentSchema>;

type Props = {
  post_id: string;
};

const CreateComment = ({ post_id }: Props) => {
  const [addComment, { isLoading }] = useAddNewCommentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
    },
    mode: 'onChange',
  });

  const content = watch('content') ?? '';

  const handleAddComment = async (values: FormValues) => {
    try {
      const result = await addComment({
        post_id,
        content: values.content.trim(),
      }).unwrap();

      toast.success(
        result.message || 'Your comment has been posted successfully.',
      );

      reset();
      setFocus('content');
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          'Failed to post your comment.',
      );
    }
  };

  return (
    <div className="bg-background p-4">
      <form onSubmit={handleSubmit(handleAddComment)} className="space-y-2">
        <Textarea
          {...register('content')}
          rows={2}
          disabled={isLoading}
          placeholder="Write a comment..."
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(handleAddComment)();
            }
          }}
        />

        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length}/5000
          </span>

          <Button type="submit" disabled={isLoading || !isValid}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Commenting...
              </>
            ) : (
              <>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
