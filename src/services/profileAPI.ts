import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface AdminProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin';
  created_at: string;
  updated_at: string;
  profile_picture: string | null;
  isVerified: boolean;
  admins: {
    user_id: string;
    is_superadmin: boolean;
  };
}

interface EmployerData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  profile_picture?: string;
  isVerified: boolean;
  employers: {
    user_id: string;
    company_name: string;
    remaining_job_posts: number;
  };
  company_name: string;
}


interface JobseekerProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'jobseeker';
  created_at: string;
  updated_at: string;
  profile_picture: string | null;
  isVerified: boolean;
  jobseekers: {
      user_id: string;
      
  }
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}


export const profilesApi = createApi({
  reducerPath: 'profilesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_USERS_API_URL,
    credentials: "include"
  }),
  endpoints: (builder) => ({
    //  get the admin profile
    getAdminProfile: builder.query<ApiResponse<AdminProfile>, void>({
      query: () => '/user/admin/profile',
    }),

    updateAdminProfile: builder.mutation({
      query: (data: { id: string; first_name?: string; last_name?: string; profile_picture?: File }) => {
        const formData = new FormData();
        if (data.first_name) formData.append("firstname", data.first_name);
        if (data.last_name) formData.append("lastname", data.last_name);
        if (data.profile_picture) formData.append("profile_picture", data.profile_picture);

        return {
          url: `/user/admin/updateprofile/${data.id}`,
          method: "PUT",
          body: formData,
        };
      }, 
    }),

    // get the employer profile
    getEmployerProfile: builder.query<ApiResponse<EmployerData>, void>({
      query: () => '/user/employer/profile', // Assuming this is the correct URL
    }),

    // Update Employer Profile
    updateEmployerProfile: builder.mutation<any, { id: string; first_name?: string; last_name?: string; profile_picture?: File }>({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        if (data.first_name) formData.append("firstname", data.first_name);
        if (data.last_name) formData.append("lastname", data.last_name);
        if (data.profile_picture) formData.append("profile_picture", data.profile_picture);

        return {
          url: `/user/employer/updateprofile/${id}`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    //  get the jobseeker profile
    getJobseekerProfile: builder.query<ApiResponse<JobseekerProfile>, void>({
      query: () => '/user/jobseeker/profile', // Assuming this is the correct URL
    }),
  }),
});


export const { 
    useGetAdminProfileQuery,
    useGetEmployerProfileQuery,
    useGetJobseekerProfileQuery,
    useUpdateAdminProfileMutation,
    useUpdateEmployerProfileMutation
} = profilesApi;
