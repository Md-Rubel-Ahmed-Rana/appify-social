import { apiSlice } from '@/redux';

const likeApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    like: build.mutation({
      query: (data: {
        target_id: string;
        target_type: 'post' | 'comment' | 'reply';
      }) => ({
        url: `/likes`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['posts'],
    }),

    unlike: build.mutation({
      query: (data: {
        target_id: string;
        target_type: 'post' | 'comment' | 'reply';
      }) => ({
        url: `/likes`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['posts'],
    }),
  }),
});

export const { useLikeMutation, useUnlikeMutation } = likeApi;
