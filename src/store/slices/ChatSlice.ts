import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [
    { id: 1, text: "👋 Hello! What can I help you with today?", sender: 'bot' }
  ]
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    }
  }
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;