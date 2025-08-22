// services/paymentAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentAPI = createApi({
  reducerPath: "paymentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL, 
    credentials: "include"
  }),
  endpoints: (builder) => ({
    initializeEmployerPayment: builder.mutation<any, { amount: number; phoneNumber: string }>({
      query: (body) => ({
        url: "/subscription/pay",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useInitializeEmployerPaymentMutation } = paymentAPI;
