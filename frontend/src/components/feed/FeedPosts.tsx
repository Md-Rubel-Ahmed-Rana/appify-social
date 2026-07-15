'use client';

import { useFeedPostsQuery, useLazyFeedPostsQuery } from '@/api/posts';
import PostsContainer from '../posts';

const FeedPosts = () => {
  const { data: result, error, isLoading, refetch } = useFeedPostsQuery({});

  const [fetchMore, { isFetching: isFetchingMore }] = useLazyFeedPostsQuery();

  return (
    <PostsContainer
      fetchMore={fetchMore}
      isFetchingMore={isFetchingMore}
      isLoading={isLoading}
      meta={result?.data?.meta}
      posts={result?.data?.posts || []}
      refetch={refetch}
      error={error}
    />
  );
};

export default FeedPosts;
