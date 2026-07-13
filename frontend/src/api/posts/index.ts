import { apiSlice } from '@/redux';

const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    publishPost: build.mutation({
      query: (formdata: FormData) => ({
        url: `/posts`,
        method: 'POST',
        body: formdata,
      }),
      invalidatesTags: ['posts'],
    }),

    feedPosts: build.query({
      query: ({ nextCursor }: { nextCursor?: string | null } = {}) => ({
        url: nextCursor ? `/posts?cursor=${nextCursor}` : '/posts',
      }),
      providesTags: ['posts'],
    }),

    getLikesByPost: build.query({
      query: ({ post_id }: { post_id: string }) => ({
        url: `/posts/${post_id}/likes`,
      }),
      providesTags: ['posts'],
    }),
  }),
});

export const {
  usePublishPostMutation,
  useFeedPostsQuery,
  useLazyFeedPostsQuery,
  useGetLikesByPostQuery,
} = postApi;
