import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PostJobResponse {
  message: string;
  data?: unknown;
}

export interface Job {
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

// Define the correct Pagination type based on your API response
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Define the correct GetAllJobsResponse type
export interface GetAllJobsResponse {
  data: Job[];
  pagination: Pagination;
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

    // Update Posted Jobs
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

    admindeleteJob: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/jobs/admindeletejob/${id}`,
        method: 'DELETE',
      }),
    }),

    // Admin Get all JObs 
    getAllJobs: builder.query<GetAllJobsResponse, number>({
      query: (page = 1) => ({
        url: `jobs/getalljobs?page=${page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { usePostJobMutation, useGetMyJobsQuery, useUpdateJobMutation, useDeleteJobMutation, useGetAllJobsQuery, useAdmindeleteJobMutation } = jobAPI;
