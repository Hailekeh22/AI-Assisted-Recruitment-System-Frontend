import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const compliantApi = createApi({
  reducerPath: "compliantAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    credentials: "include"
  }),
  endpoints: (builder) => ({
    getMyCompliants: builder.query<any,void>({
      query: () => "/mycomplaints",
    }),
  }),
});

export const { useGetMyCompliantsQuery } = compliantApi;
