import { SigninInput } from "@/components/auth/signin/signin-schema";
import { SignupInput } from "@/components/auth/signup/signup-schema";
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
      query: (data: SigninInput) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    register: build.mutation({
      query: (data: SignupInput) => ({
        url: `/auth/register`,
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

export const {
  useGetUserProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = authApi;
