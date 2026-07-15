import { useState } from 'react';
import CreatePostModal from '../create-post';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user.type';

type Props = {
  user: User;
};

const AuthorPostHeader = ({ user }: Props) => {
  const [isCreatePost, setIsCreatePost] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">My Posts</h1>
          <p className="text-sm text-muted-foreground">
            Manage all your published posts.
          </p>
        </div>
        <Button onClick={() => setIsCreatePost(true)}>Create Post</Button>
      </div>
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

export default AuthorPostHeader;
