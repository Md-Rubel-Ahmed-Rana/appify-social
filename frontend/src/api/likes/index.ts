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
      invalidatesTags: ['posts', 'comments', 'replies'],
    }),

    getLikes: build.query({
      query: ({
        target_id,
        target_type,
      }: {
        target_id: string;
        target_type: 'post' | 'comment' | 'reply';
      }) => ({
        url: `/likes?target_id=${target_id}&target_type=${target_type}`,
      }),
      providesTags: ['posts', 'comments', 'replies'],
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
      invalidatesTags: ['posts', 'comments', 'replies'],
    }),
  }),
});

export const { useLikeMutation, useUnlikeMutation, useGetLikesQuery } = likeApi;
