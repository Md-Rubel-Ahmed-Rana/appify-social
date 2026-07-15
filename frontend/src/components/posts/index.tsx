/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import EmptyPost from './EmptyPost';
import PostError from './PostError';
import PostCardSkeleton from './PostCardSkeleton';
import PostCard from '../post-card';
import { Post } from '@/types/post.type';
import PostEnd from './PostEnd';
import { TypedLazyQueryTrigger } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

type Props = {
  posts: Post[];
  meta: { next_cursor: string | null; has_more: boolean };
  error?: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  refetch: () => void;
  fetchMore: TypedLazyQueryTrigger<any, any, any>;
  isFetchingMore: boolean;
};

const PostsContainer = ({
  posts,
  fetchMore,
  isLoading,
  refetch,
  error,
  meta,
  isFetchingMore,
}: Props) => {
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);

  const [feedMeta, setFeedMeta] = useState({
    next_cursor: null as string | null,
    has_more: false,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadingRef = useRef(false);

  const requestedCursorRef = useRef<string | null>(null);

  const nextCursorRef = useRef<string | null>(null);

  const hasMoreRef = useRef(false);

  useEffect(() => {
    if (!posts.length) return;

    setFeedPosts(posts);

    setFeedMeta({
      next_cursor: meta.next_cursor,
      has_more: meta.has_more,
    });

    nextCursorRef.current = meta.next_cursor;
    hasMoreRef.current = meta.has_more;
  }, [posts]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;

    if (!hasMoreRef.current) return;

    if (!nextCursorRef.current) return;

    if (requestedCursorRef.current === nextCursorRef.current) return;

    loadingRef.current = true;

    requestedCursorRef.current = nextCursorRef.current;

    try {
      const result = await fetchMore({
        nextCursor: nextCursorRef.current,
      }).unwrap();

      const newPosts = (result.data.posts ?? []) as Post[];

      setFeedPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));

        return [...prev, ...newPosts.filter((p) => !ids.has(p.id))];
      });

      setFeedMeta({
        next_cursor: result.data.meta.next_cursor,
        has_more: result.data.meta.has_more,
      });

      nextCursorRef.current = result?.data?.meta?.next_cursor;
      hasMoreRef.current = result?.data?.meta?.has_more;
    } finally {
      loadingRef.current = false;
    }
  }, [fetchMore]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      observerRef.current?.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        {
          rootMargin: '300px',
        },
      );

      observerRef.current.observe(node);
    },
    [loadMore],
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

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
    return <PostError onRetry={refetch} />;
  }

  if (!feedPosts.length) {
    return <EmptyPost />;
  }

  return (
    <div className="space-y-2">
      {feedPosts.map((post, index) => {
        const isLast = index === feedPosts.length - 1;

        return (
          <div key={post.id} ref={isLast ? lastPostRef : undefined}>
            <PostCard post={post} />
          </div>
        );
      })}

      {isFetchingMore && (
        <div className="space-y-3 pt-2">
          <PostCardSkeleton />
        </div>
      )}

      {!feedMeta.has_more && !feedMeta.next_cursor && feedPosts.length > 0 && (
        <PostEnd />
      )}
    </div>
  );
};

export default PostsContainer;
