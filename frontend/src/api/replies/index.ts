import { apiSlice } from '@/redux';

const replyApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getReplies: build.query({
      query: ({ comment_id }: { comment_id: string }) => ({
        url: `/replies?comment_id=${comment_id}`,
      }),
      providesTags: ['comments', 'replies'],
    }),

    replyToResource: build.mutation({
      query: (data: {
        comment_id: string;
        parent_reply_id?: string;
        content: string;
      }) => ({
        url: `/replies`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['comments', 'replies'],
    }),

    editReply: build.mutation({
      query: ({
        reply_id,
        content,
      }: {
        reply_id: string;
        content: string;
      }) => ({
        url: `/replies/${reply_id}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['replies'],
    }),

    deleteReply: build.mutation({
      query: ({ reply_id }: { reply_id: string }) => ({
        url: `/replies/${reply_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['comments', 'replies'],
    }),
  }),
});

export const {
  useGetRepliesQuery,
  useReplyToResourceMutation,
  useEditReplyMutation,
  useDeleteReplyMutation,
} = replyApi;
