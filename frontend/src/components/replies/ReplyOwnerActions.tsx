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
import { Reply } from '@/types/reply.type';
import EditReplyModal from './EditReplyModal';
import { useDeleteReplyMutation } from '@/api/replies';

type Props = {
  reply: Reply;
};

const ReplyOwnerActions = ({ reply }: Props) => {
  const [isEdit, setIsEdit] = useState(false);

  const [deleteReply, { isLoading }] = useDeleteReplyMutation();

  const handleDeleteReply = async () => {
    try {
      const result = await deleteReply({ reply_id: reply.id }).unwrap();

      if (result.statusCode === 200) {
        toast.success(result.message || 'Reply has been deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete reply');
    }
  };

  return (
    <>
      {isEdit && (
        <EditReplyModal
          open={isEdit}
          setOpen={setIsEdit}
          reply_id={reply.id}
          content={reply.content}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-16">
          {reply.is_owner && (
            <>
              <DropdownMenuItem onClick={() => setIsEdit(true)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteReply}
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

export default ReplyOwnerActions;
