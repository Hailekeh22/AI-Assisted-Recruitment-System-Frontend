// src/services/applicationsAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Applications"],
  endpoints: (builder) => ({
    // fetch all applications for a job
    getApplicationsByJob: builder.query<any, number>({
      query: (jobId) => `jobs/${jobId}/applications`,
      providesTags: (result, error, jobId) => [
        { type: "Applications", id: jobId },
      ],
    }),

    //  update application status
    updateApplicationStatus: builder.mutation({
      query: ({ applicationId, status }) => ({
        url: `/applications/${applicationId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Applications"],
    }),

    getApplications: builder.query({
      query: () => ({
        url: "/job/myapplications",
      }),
    }),
  }),
});

export const {
  useGetApplicationsByJobQuery,
  useUpdateApplicationStatusMutation,
  useGetApplicationsQuery,
} = applicationsApi;
