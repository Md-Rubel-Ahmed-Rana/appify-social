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

    editComment: build.mutation({
      query: ({
        comment_id,
        content,
      }: {
        comment_id: string;
        content: string;
      }) => ({
        url: `/comments/${comment_id}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['comments'],
    }),

    deleteComment: build.mutation({
      query: ({ comment_id }: { comment_id: string }) => ({
        url: `/comments/${comment_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['comments', 'posts'],
    }),
  }),
});

export const {
  useGetCommentsByPostQuery,
  useAddNewCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
