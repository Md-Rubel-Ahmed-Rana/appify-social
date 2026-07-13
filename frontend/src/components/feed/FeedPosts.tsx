'use client';

import { useFeedPostsQuery } from '@/api/posts';

import PostCardSkeleton from './PostCardSkeleton';
import FeedError from './FeedError';
import EmptyFeed from './EmptyFeed';

import { Post } from '@/types/post.type';
import PostCard from '../post-card';

const FeedPosts = () => {
  const { data, error, isLoading, isFetching, refetch } = useFeedPostsQuery({});

  const posts = (data?.data?.posts ?? []) as Post[];

  const meta = {
    page_size: data?.data?.page_size ?? 10,
    post_count: data?.data?.post_count ?? 0,
    next_cursor: data?.data?.next_cursor ?? null,
    has_more: data?.data?.has_more ?? false,
  };

  console.log(meta);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <FeedError onRetry={refetch} />;
  }

  if (!posts.length) {
    return <EmptyFeed />;
  }

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {isFetching && (
        <div className="space-y-3 pt-2">
          <PostCardSkeleton />
        </div>
      )}
    </div>
  );
};

export default FeedPosts;
