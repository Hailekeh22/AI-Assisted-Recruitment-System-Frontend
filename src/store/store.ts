import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userRegistrationApi } from '@/services/userRegisterAPI';
import { authApi } from '@/services/authAPI';
import { chatSlice } from './slices/ChatSlice';
import { suportChatApi } from '@/services/chatAPI';
import { compliantApi } from '@/services/compliantAPI';
import { jobAPI } from '@/services/jobsAPI';



export const store = configureStore({
  reducer: {
    [userRegistrationApi.reducerPath]: userRegistrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [suportChatApi.reducerPath]: suportChatApi.reducer,
    [compliantApi.reducerPath]: compliantApi.reducer,
    [jobAPI.reducerPath]: jobAPI.reducer,
    chat: chatSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userRegistrationApi.middleware, jobAPI.middleware, compliantApi.middleware, authApi.middleware, suportChatApi.middleware),

});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
