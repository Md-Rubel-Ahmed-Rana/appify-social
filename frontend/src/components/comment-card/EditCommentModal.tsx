'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEditCommentMutation } from '@/api/comments';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  comment_id: string;
  content: string;
};

type FormValues = {
  content: string;
};

const EditCommentModal = ({ open, setOpen, comment_id, content }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      content,
    },
  });

  const [updateComment, { isLoading }] = useEditCommentMutation();

  useEffect(() => {
    if (open) {
      reset({ content });
    }
  }, [content, open, reset]);

  const handleEditComment = async (data: FormValues) => {
    try {
      const result = await updateComment({
        comment_id,
        content: data.content,
      }).unwrap();
      if (result.statusCode === 200) {
        toast.success(result.message || 'Comment has been edited successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to edit comment');
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleEditComment)} className="space-y-5">
          <Textarea
            {...register('content', {
              required: true,
              maxLength: 1000,
            })}
            rows={6}
            placeholder="Write your comment"
            className="resize-none"
          />

          <DialogFooter>
            <Button
              disabled={isLoading}
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!isDirty || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentModal;
