import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    credentials: "include"
  }),
  endpoints: (builder) => ({
    getMyCompliants: builder.query<Complaint[],void>({
      query: () => "/mycomplaints",
    }),
  }),
});

export const { useGetMyCompliantsQuery } = compliantApi;
