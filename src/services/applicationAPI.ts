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

    //Employer scheduling interviews based on applications
    scheduleInterview: builder.mutation({
      query: ({ applicationId, seekerId, scheduledTime, location }) => ({
        url: `/interview/schedule`,
        method: "POST",
        body: { applicationId, seekerId, scheduledTime, location },
      }),
    }),

    //Employer fetching their scheduled interviews
    getEmployerInterviews: builder.query({
      query: () => "/employer/interviews",
    }),

    //Get job seeker interviews
    getJobSeekerInterviews: builder.query({
      query: () => ({
        url: "/jobseeker/interviews",
        method: "GET",
      }),
    }),

    //send email message to the job seeker
    sendMessage: builder.mutation<
      { success: boolean; message: string },
      { seekerId: string; message: string }
    >({
      query: ({ seekerId, message }) => ({
        url: "/sendmessage",
        method: "POST",
        body: { seekerId, message },
      }),
    }),

    //send email message to the employer
    sendMessageToEmployer: builder.mutation<
      { success: boolean; message: string },
      { employerId: string; message: string }
    >({
      query: ({ employerId, message }) => ({
        url: "/sendmessagetoemployer",
        method: "POST",
        body: { employerId, message },
      }),
    }),

    getInterviewPreparation: builder.mutation<
      { message: string; tips: string },
      { jobId: number }
    >({
      query: ({ jobId }) => ({
        url: "/interviews/prep",
        method: "POST",
        body: { jobId },
      }),
    }),
  }),
});

export const {
  useGetApplicationsByJobQuery,
  useUpdateApplicationStatusMutation,
  useGetApplicationsQuery,
  useScheduleInterviewMutation,
  useGetEmployerInterviewsQuery,
  useGetJobSeekerInterviewsQuery,
  useSendMessageMutation,
  useSendMessageToEmployerMutation,
  useGetInterviewPreparationMutation
} = applicationsApi;
