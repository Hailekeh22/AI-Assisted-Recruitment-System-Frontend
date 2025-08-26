import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  role: "employer" | "jobseeker" | "admin;"
  profile_picture: string | null;
  isVerified: boolean;
}

// Pagination type
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API Response
export interface GetAllUsersResponse {
  data: User[];
  pagination: Pagination;
}

export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL, 
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // GET all users with pagination
    getAllUsers: builder.query<GetAllUsersResponse, number>({
      query: (page = 1) => `/admin/allusers?page=${page}`,
      providesTags: ["Users"],
    }),

    // Admin delete user
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetAllUsersQuery, useDeleteUserMutation } = usersAPI;
