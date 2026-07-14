'use client';

import { ImagePlus, Globe2, ChevronDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGetUserProfileQuery } from '@/api/auth';
import { User } from '@/types/user.type';
import { useState } from 'react';
import CreatePostModal from '../create-post';

const CreatePostCard = () => {
  const [isCreatePost, setIsCreatePost] = useState(false);
  const { data } = useGetUserProfileQuery({});
  const user = data?.data as User;

  return (
    <>
      <section className="rounded-md border bg-background p-2 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <button
            onClick={() => setIsCreatePost(true)}
            type="button"
            className="flex h-11 flex-1 items-center rounded-full bg-muted px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/80 cursor-pointer"
          >
            What&apos;s on your mind, {user.first_name}?
          </button>
        </div>

        <div className="my-3 h-px bg-border" />

        <div className="flex items-center justify-between">
          <Button
            onClick={() => setIsCreatePost(true)}
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full"
          >
            <ImagePlus className="size-4 text-green-600" />
            Photo
          </Button>

          <Button
            onClick={() => setIsCreatePost(true)}
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full"
          >
            <Globe2 className="size-4" />
            Public
            <ChevronDown className="size-4 opacity-60" />
          </Button>
        </div>
      </section>
      {isCreatePost && (
        <CreatePostModal
          open={isCreatePost}
          setOpen={setIsCreatePost}
          user={user}
        />
      )}
    </>
  );
};

export default CreatePostCard;
