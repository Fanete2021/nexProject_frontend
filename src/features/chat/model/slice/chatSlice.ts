import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatSchema } from '../types/chat.ts';
import { ChatInfo } from '../types/chatInfo.ts';
import { fetchChats } from '../service/fetchChats.ts';
import { fetchSelectedChatInfo } from '../service/fetchSelectedChatInfo.ts';
import { Message } from '../types/message.ts';

const initialState: ChatSchema = {
  dialogs: [],
  isLoadingDialogs: false,
  selectedChat: undefined,
  isLoadingSelectedChat: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setDialogs: (state, action: PayloadAction<Chat[]>) => {
      state.dialogs = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<ChatInfo>) => {
      state.selectedChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const newMessage = action.payload;

      const chatIndex = state.dialogs.findIndex((dialog) => dialog.chatId === newMessage.chatId);
      if (chatIndex !== -1) {
        const chat = state.dialogs[chatIndex];
        chat.lastMessage = newMessage;
        state.dialogs.splice(chatIndex, 1);
        state.dialogs.unshift(chat);
      }


      if (state.selectedChat?.chatId === newMessage.chatId) {
        state.selectedChat.lastMessages.unshift(newMessage);
      }

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state: ChatSchema) => {
        state.isLoadingDialogs = true;
      })
      .addCase(fetchChats.fulfilled, (state: ChatSchema, action) => {
        state.dialogs = action.payload.chats;
        state.isLoadingDialogs = false;
      })
      .addCase(fetchChats.rejected, (state: ChatSchema) => {
        state.isLoadingDialogs = false;
      })
      .addCase(fetchSelectedChatInfo.pending, (state: ChatSchema) => {
        state.isLoadingSelectedChat = true;
      })
      .addCase(fetchSelectedChatInfo.fulfilled, (state: ChatSchema, action) => {
        state.selectedChat = action.payload;
        state.isLoadingSelectedChat = false;
      })
      .addCase(fetchSelectedChatInfo.rejected, (state: ChatSchema) => {
        state.isLoadingSelectedChat = false;
      });
  }
});

export const { actions: chatActions } = chatSlice;
export const { reducer: chatReducer } = chatSlice;
