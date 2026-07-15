/* eslint-disable react-hooks/incompatible-library */
import { useForm } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { Reply } from '@/types/reply.type';
import { useReplyToResourceMutation } from '@/api/replies';
import { toast } from 'sonner';

type Props = {
  reply?: Reply;
  comment_id: string;
  onCancel: () => void;
};

type FormValues = {
  content: string;
};

const ReplyForm = ({ reply, onCancel, comment_id }: Props) => {
  const { register, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      content: '',
    },
  });

  const [newReply, { isLoading }] = useReplyToResourceMutation();

  const content = watch('content');

  const submitHandler = async ({ content }: FormValues) => {
    const value = content.trim();

    if (!value) return;

    const replyPayload = {
      comment_id: comment_id,
      parent_reply_id: reply ? reply.id : undefined,
      content: value,
    };

    try {
      const result = await newReply(replyPayload).unwrap();
      if (result?.statusCode === 201) {
        toast.success(result.message || 'Reply has been added successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to reply. Please try again!');
    }

    reset();
    onCancel();
  };

  return (
    <div className="mt-3 rounded-lg border bg-muted/20 p-3">
      {reply && reply.id && (
        <p className="mb-3 text-xs text-muted-foreground">
          Replying to{' '}
          <span className="font-medium text-foreground">
            {reply.author.name}
          </span>
        </p>
      )}

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
        <Textarea
          {...register('content')}
          rows={3}
          maxLength={5000}
          placeholder="Write a reply..."
          className="resize-none"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length}/5000
          </span>

          <div className="flex items-center gap-2">
            <Button
              disabled={isLoading}
              onClick={onCancel}
              type="button"
              variant="ghost"
              size="sm"
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Replying...' : 'Reply'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
