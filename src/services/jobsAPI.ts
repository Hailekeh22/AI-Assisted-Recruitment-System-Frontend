import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PostJobResponse {
  message: string;
  data?: unknown;
}

interface Job {
  job_id: number;
  employer_id: string;
  title: string;
  description: string;
  job_type: string;
  requirements: string;
  salary: string;
  application_deadline: string;
  status: string;
  created_at: string;
}

interface MyJobsResponse {
  myJobs: Job[];
}

export const jobAPI = createApi({
  reducerPath: "jobAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    //GEt Posted Jobs
    getMyJobs: builder.query<MyJobsResponse, void>({
      query: () => ({
        url: "jobs/myjobs",
        method: "GET",
      }),
    }),

    // POST a new job with FormData
    postJob: builder.mutation<PostJobResponse, FormData>({
      query: (formData) => ({
        url: "/jobs/createjob",
        method: "POST",
        body: formData,
      }),
    }),

    //Update Posted Jobs
   updateJob: builder.mutation({
      query: ({ id, body }) => ({
        url: `/jobs/updatejob/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

     deleteJob: builder.mutation<{ message: string }, number>({ 
      query: (id) => ({
        url: `/jobs/deletejob/${id}`,
        method: 'DELETE',
      }),
    }),
 
  }),
});

export const { usePostJobMutation, useGetMyJobsQuery, useUpdateJobMutation, useDeleteJobMutation } = jobAPI;
