import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userRegistrationApi } from '@/services/userRegisterAPI';
import { loginApi } from '@/services/loginAPI';



export const store = configureStore({
  reducer: {
    [userRegistrationApi.reducerPath]: userRegistrationApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userRegistrationApi.middleware, loginApi.middleware),

});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;