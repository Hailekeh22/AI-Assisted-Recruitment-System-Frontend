import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "inspector";

export interface Complaint {
  complaint_id: number;
  content: string;
  status: "open" | "resolved" | "dismissed";
  filed_at: string;
  handled_by?: string;
  handled_at?: string;
  resolution_note?: string;
}

export const compliantApi = createApi({
  reducerPath: "compliantAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMyCompliants: builder.query<Complaint[], void>({
      query: () => "/mycomplaints",
    }),
    postComplaint: builder.mutation({
      query: (userData) => ({
        url: "/submitcomplaint",
        method: "POST",
        body: userData,
        credentials: "include",
      }),
    }),
    deleteComplaint: builder.mutation({
      query: (id) => ({
        url: `/complaint/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    getAdminComplaints: builder.query<{ data: Complaint[]; pagination: any },number>({
      query: (page = 1) => `/complaints?page=${page}`,
    }),
    respondToComplaint: builder.mutation({
      query: ({ complaintId, resolutionNote, status }) => ({
        url: "/complaint/respond",
        method: "POST",
        body: { complaintId, resolutionNote, status },
        credentials: "include",
      }),
    }),
    adminDeleteComplain: builder.mutation({
      query: (id) => ({
        url: `/admin/complaint/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    })
  }),
});

export const {
  useGetMyCompliantsQuery,
  usePostComplaintMutation,
  useDeleteComplaintMutation,
  useGetAdminComplaintsQuery,
  useRespondToComplaintMutation,
  useAdminDeleteComplainMutation
} = compliantApi;
