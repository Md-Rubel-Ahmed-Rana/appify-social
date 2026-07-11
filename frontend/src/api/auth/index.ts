import { LoginInput } from "@/components/auth/signin/login-schema";
import { apiSlice } from "@/redux";

const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query({
      query: () => ({
        url: `/auth/me`,
      }),
      providesTags: ["auth"],
    }),
    login: build.mutation({
      query: (data: LoginInput) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    logout: build.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "DELETE",
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const { useGetUserProfileQuery, useLoginMutation, useLogoutMutation } =
  authApi;
