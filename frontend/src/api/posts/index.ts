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

    getPostsByAuthor: build.query({
      query: ({ nextCursor }: { nextCursor?: string | null } = {}) => ({
        url: nextCursor
          ? `/posts/author?cursor=${nextCursor}`
          : '/posts/author',
      }),
      providesTags: ['posts'],
    }),

    deletePost: build.mutation({
      query: ({ post_id }: { post_id: string }) => ({
        url: `/posts/${post_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['posts'],
    }),

    editPost: build.mutation({
      query: ({ post_id, content }: { post_id: string; content: string }) => ({
        url: `/posts/${post_id}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['posts'],
    }),
  }),
});

export const {
  usePublishPostMutation,
  useFeedPostsQuery,
  useLazyFeedPostsQuery,
  useDeletePostMutation,
  useEditPostMutation,
  useGetPostsByAuthorQuery,
} = postApi;
