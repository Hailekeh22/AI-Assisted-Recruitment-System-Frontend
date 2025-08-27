import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quickJobsApi = createApi({
  reducerPath: "quickJobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    credentials: "include",
  }),
  tagTypes: ["quickJobs"],
  endpoints: (builder) => ({
    //get quick job profile
    getQuickJobProfile: builder.query({
      query: () => ({
        url: "/quickjob/profile",
        method: "GET",
      }),
    }),

    //create a quick job profile
    createQuickJobProfile: builder.mutation({
      query: (body) => ({
        url: `/quickjob/profile`,
        method: "POST",
        body,
      }),
    }),

    // Update quick job profile
    updateQuickJobProfile: builder.mutation({
      query: (body) => ({
        url: `/quickjob/profile`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetQuickJobProfileQuery,
  useCreateQuickJobProfileMutation,
  useUpdateQuickJobProfileMutation,
} = quickJobsApi;
