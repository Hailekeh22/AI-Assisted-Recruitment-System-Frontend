import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userRegistrationApi } from '@/services/userRegisterAPI';
import { authApi } from '@/services/authAPI';



export const store = configureStore({
  reducer: {
    [userRegistrationApi.reducerPath]: userRegistrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userRegistrationApi.middleware, authApi.middleware),

});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;