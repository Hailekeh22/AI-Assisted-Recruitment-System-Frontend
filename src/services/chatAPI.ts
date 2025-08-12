import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const suportChatApi = createApi({
    reducerPath: "supportChatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    }),
    endpoints: (builder) => ({
        askchatbot: builder.mutation({
            query: (chatInput) => ({
                url: "/chat",
                method: "POST",
                body: chatInput
            })
        })
    })
})

export const { useAskchatbotMutation } = suportChatApi;
