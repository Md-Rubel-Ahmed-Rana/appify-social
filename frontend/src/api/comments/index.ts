import { apiSlice } from '@/redux';

const commentApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCommentsByPost: build.query({
      query: ({
        next_cursor,
        postId,
      }: {
        next_cursor: string;
        postId: string;
      }) => ({
        url: next_cursor
          ? `/posts/${postId}/comments/?cursor=${next_cursor}`
          : `/posts/${postId}/comments`,
      }),
      providesTags: ['comments', 'posts'],
    }),

    addNewComment: build.mutation({
      query: (data: { post_id: string; content: string }) => ({
        url: `/comments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['posts', 'comments'],
    }),
  }),
});

export const { useGetCommentsByPostQuery, useAddNewCommentMutation } =
  commentApi;
