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

    //ensure the quick job poster id is registed on quickjobposters table
    ensurePoster: builder.query({
      query: () => ({
        url: "/ensurequickjobposterprofile",
        method: "GET",
      }),
    }),

    //quick job poster posts quickjobs
    createQuickJob: builder.mutation({
      query: (data) => ({
        url: "/postquickjob",
        method: "POST",
        body: data,
      }),
    }),

    fetchQuickJobs: builder.query<any, number>({
      query: (page = 1) => `/quickjobs?page=${page}`,
      providesTags: ["quickJobs"],
    }),

    fetchMyQuickJobs: builder.query<any, number>({
      query: (data) => ({
        url: `/myquickjobs`,
      }),
    }),

    fetchQuickJobApplications: builder.query<any, number>({
      query: (jobId) => `/myquickjobs/applications/${jobId}`,
    }),

    applyQuickJob: builder.mutation<any, number>({
      query: (quickJobId) => ({
        url: "/quickjobs/apply",
        method: "POST",
        body: { quickJobId },
      }),
    }),

    hireQuickJobSeeker: builder.mutation({
      query: (assignmentId) => ({
        url: `/quickjobs/applications/${assignmentId}/hire`,
        method: "PUT",
      }),
      invalidatesTags: ["quickJobs"],
    }),

    updateQuickJobStatus: builder.mutation<
      any,
      {
        assignmentId: number;
        status: "completed" | "cancelled";
        rating?: number;
      }
    >({
      query: ({ assignmentId, status, rating }) => ({
        url: `/quickjobs/${assignmentId}/status`,
        method: "PUT",
        body: { status, rating },
      }),
      invalidatesTags: ["quickJobs"],
    }),
  }),
});

export const {
  useGetQuickJobProfileQuery,
  useCreateQuickJobProfileMutation,
  useUpdateQuickJobProfileMutation,
  useEnsurePosterQuery,
  useCreateQuickJobMutation,
  useFetchQuickJobsQuery,
  useFetchMyQuickJobsQuery,
  useFetchQuickJobApplicationsQuery,
  useApplyQuickJobMutation,
  useHireQuickJobSeekerMutation,
  useUpdateQuickJobStatusMutation,
} = quickJobsApi;
