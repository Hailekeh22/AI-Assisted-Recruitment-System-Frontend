import { configureStore } from '@reduxjs/toolkit';
import { userRegistrationApi } from '@/services/userRegisterAPI';
import { setupListeners } from '@reduxjs/toolkit/query';


export const store = configureStore({
  reducer: {
    [userRegistrationApi.reducerPath]: userRegistrationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userRegistrationApi.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;