import { apiSlice } from "@/redux";

const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    publishPost: build.mutation({
      query: (formdata: FormData) => ({
        url: `/posts`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["posts"],
    }),
  }),
});

export const { usePublishPostMutation } = postApi;
