import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userRegistrationApi } from '@/services/userRegisterAPI';
import { authApi } from '@/services/authAPI';
import { chatSlice } from './slices/ChatSlice';
import { suportChatApi } from '@/services/chatAPI';
import { compliantApi } from '@/services/compliantAPI';
import { jobAPI } from '@/services/jobsAPI';
import { emailSlice } from './slices/emailSlice';
import { applicationsApi } from '@/services/applicationAPI';
import { profilesApi } from '@/services/profileAPI';
import { paymentAPI } from '@/services/paymentAPI';
import { authSlice } from './slices/authSlice';
import { usersAPI } from '@/services/usersAPI';
import { quickJobsApi } from '@/services/quickJobsAPI';






export const store = configureStore({
  reducer: {
    [userRegistrationApi.reducerPath]: userRegistrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [suportChatApi.reducerPath]: suportChatApi.reducer,
    [compliantApi.reducerPath]: compliantApi.reducer,
    [jobAPI.reducerPath]: jobAPI.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [profilesApi.reducerPath]: profilesApi.reducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    [quickJobsApi.reducerPath]: quickJobsApi.reducer,
    chat: chatSlice.reducer,
    email: emailSlice.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userRegistrationApi.middleware, usersAPI.middleware, jobAPI.middleware,paymentAPI.middleware ,compliantApi.middleware, quickJobsApi.middleware, authApi.middleware, suportChatApi.middleware,profilesApi.middleware, applicationsApi.middleware),

});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
