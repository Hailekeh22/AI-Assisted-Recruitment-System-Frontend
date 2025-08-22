// src/services/applicationsAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    credentials: "include"
  }),
  tagTypes: ["Applications"],
  endpoints: (builder) => ({
    // fetch all applications for a job
    getApplicationsByJob: builder.query<any, number>({
      query: (jobId) => `jobs/${jobId}/applications`,
      providesTags: (result, error, jobId) => [{ type: "Applications", id: jobId }],
    }),

    //  update application status 
    updateApplicationStatus: builder.mutation<
      any,
      { applicationId: number; status: string }
    >({
      query: ({ applicationId, status }) => ({
        url: `/applications/${applicationId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "Applications", id: applicationId },
      ],
    }),
  }),
});

export const {
  useGetApplicationsByJobQuery,
  useUpdateApplicationStatusMutation,
} = applicationsApi;
