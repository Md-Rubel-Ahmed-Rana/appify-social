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
  }),
});

export const { useGetRepliesQuery, useReplyToResourceMutation } = replyApi;
