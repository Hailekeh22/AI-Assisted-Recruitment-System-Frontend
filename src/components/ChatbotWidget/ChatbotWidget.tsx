"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ChatBot } from '../chatBot/chatBot';


const ChatbotWidget = () => {
  return (
    <Provider store={store}>
      <ChatBot />
    </Provider>
  );
};

export default ChatbotWidget;
