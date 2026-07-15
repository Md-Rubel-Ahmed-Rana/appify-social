'use client';

import { useGetUserProfileQuery } from '@/api/auth';
import AuthorPosts from '@/components/author-posts';
import RenderColdStartDialog from '@/components/common/render-free-plan-alert';
import { User } from '@/types/user.type';

const AuthorPostsPage = () => {
  const { data, isLoading } = useGetUserProfileQuery({});
  const user = data?.data as User;

  if (isLoading) {
    return <RenderColdStartDialog open={isLoading} />;
  }

  return <AuthorPosts user={user} />;
};

export default AuthorPostsPage;
