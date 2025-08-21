import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userRegistrationApi = createApi({
  reducerPath: "userRegistrationApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL }),
  endpoints: (builder) => ({
    registerEmployer: builder.mutation({
      query: (userData) => ({
        url: "/user/employer/register",
        method: "POST",
        body: userData,
      }),
    }),
    registerJobSeeker: builder.mutation({
      query: (userData) => ({
        url: "/user/employee/register",
        method: "POST",
        body: userData,
      }),
    }),
    registerAdmin: builder.mutation({
      query: (userData) => ({
        url: "/user/admin/register",
        method: "POST",
        body: userData,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "/user/verifyemail",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterEmployerMutation,
  useRegisterJobSeekerMutation,
  useRegisterAdminMutation,
  useVerifyEmailMutation
} = userRegistrationApi;
