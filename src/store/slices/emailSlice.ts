// emailSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmailState {
  value: string | null;
}
const initialState: EmailState = { value: null };

export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clearEmail: (state) => {
      state.value = null;
    }
  }
});

export const { setEmail, clearEmail } = emailSlice.actions;
export default emailSlice.reducer;
