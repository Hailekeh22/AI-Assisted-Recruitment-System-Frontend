import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loginApi = createApi({
    reducerPath: 'loginApi',
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL}),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (userData) => ({
                url: '/login',
                method: 'POST',
                body: userData
            })
        })
    })
})

export const { useLoginUserMutation} = loginApi;