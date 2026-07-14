'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useGetLikesQuery } from '@/api/likes';

type Props = {
  target_id: string;
  target_type: 'post' | 'comment' | 'reply';
  open: boolean;
  setOpen: (value: boolean) => void;
};

type Liker = {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

const LikersModal = ({ open, setOpen, target_id, target_type }: Props) => {
  const { data, isLoading } = useGetLikesQuery(
    { target_id, target_type },
    {
      skip: !open,
    },
  );

  const likers = (data?.data ?? []) as Liker[];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : likers.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No likes yet.
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="space-y-3">
              {likers.map((liker, index) => (
                <div
                  key={liker?.user_id || index}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={liker.avatar_url ?? ''} />
                    <AvatarFallback>
                      {liker.first_name[0]}
                      {liker.last_name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">
                      {liker.first_name} {liker.last_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LikersModal;
