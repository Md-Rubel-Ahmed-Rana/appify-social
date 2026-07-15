'use client';

import Link from 'next/link';
import { SquarePlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGetUserProfileQuery } from '@/api/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import LogoutButton from '../common/logout-button';
import { User } from '@/types/user.type';
import CreatePostModal from '../create-post';

const Navbar = () => {
  const [isCreatePost, setIsCreatePost] = useState(false);
  const { data, isLoading, isError } = useGetUserProfileQuery({});

  const user = data?.data as User;

  const initials = useMemo(() => {
    if (!user) return 'U';

    return `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase();
  }, [user]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 lg:px-6 px-2">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src={'/images/logo.png'}
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />

            <span className="text-lg font-semibold">Appify Social</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              className="-mt-2 cursor-pointer"
              onClick={() => setIsCreatePost(true)}
            >
              <SquarePlus />
            </button>

            {isLoading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
            ) : isError || !user ? (
              <Avatar>
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url ?? ''} />

                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                  <div className="space-y-1 px-3 py-2">
                    <p className="font-medium">
                      {user.first_name} {user.last_name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {user?.bio || user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <Link href={'/profile/posts'}>
                    <DropdownMenuItem className="cursor-pointer">
                      My Posts
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-red-600">
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
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

export default Navbar;
