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
import { useEditPostMutation } from '@/api/posts';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  post_id: string;
  content: string;
};

type FormValues = {
  content: string;
};

const EditPostModal = ({ open, setOpen, post_id, content }: Props) => {
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

  const [updatePost, { isLoading }] = useEditPostMutation();

  useEffect(() => {
    if (open) {
      reset({ content });
    }
  }, [content, open, reset]);

  const handleEditPost = async (data: FormValues) => {
    try {
      const result = await updatePost({
        post_id,
        content: data.content,
      }).unwrap();
      if (result.statusCode === 200) {
        toast.success(result.message || 'Post has been edited successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to edit post');
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleEditPost)} className="space-y-5">
          <Textarea
            {...register('content', {
              required: true,
              maxLength: 1000,
            })}
            rows={6}
            placeholder="What's on your mind?"
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

export default EditPostModal;
