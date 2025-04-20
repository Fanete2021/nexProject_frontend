import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatSchema } from '../types/chat.ts';
import { ChatInfo } from '../types/chatInfo.ts';
import { fetchChats } from '../service/fetchChats.ts';
import { fetchChatInfo } from '../service/fetchChatInfo.ts';
import { fetchMessages } from '../service/fetchMessages.ts';
import { Message } from '../types/message.ts';

const initialState: ChatSchema = {
  dialogs: [],
  isLoadingDialogs: false,
  selectedChat: undefined,
  isLoadingSelectedChat: false,
  isActiveInfoPanel: false,
  isLoadingMessages: false,
  messageDrafts: {}
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setDialogs: (state, action: PayloadAction<Chat[]>) => {
      state.dialogs = action.payload;
    },
    addDialogs: (state, action: PayloadAction<Chat[]>) => {
      state.dialogs.push(...action.payload);
    },
    setSelectedChat: (state, action: PayloadAction<ChatInfo | undefined>) => {
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
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.dialogs.unshift(action.payload);
    },
    setIsActiveInfoPanel: (state, action: PayloadAction<boolean>) => {
      state.isActiveInfoPanel = action.payload;
    },
    setMessageDraft(state, action: PayloadAction<{ chatId: string; message: string }>) {
      state.messageDrafts[action.payload.chatId] = action.payload.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state: ChatSchema) => {
        state.isLoadingDialogs = true;
      })
      .addCase(fetchChats.fulfilled, (state: ChatSchema) => {
        state.isLoadingDialogs = false;
      })
      .addCase(fetchChats.rejected, (state: ChatSchema) => {
        state.isLoadingDialogs = false;
      })
      .addCase(fetchChatInfo.pending, (state: ChatSchema) => {
        state.isLoadingSelectedChat = true;
      })
      .addCase(fetchChatInfo.fulfilled, (state: ChatSchema) => {
        state.isLoadingSelectedChat = false;
      })
      .addCase(fetchChatInfo.rejected, (state: ChatSchema) => {
        state.isLoadingSelectedChat = false;
      })
      .addCase(fetchMessages.pending, (state: ChatSchema) => {
        state.isLoadingMessages = true;
      })
      .addCase(fetchMessages.fulfilled, (state: ChatSchema, action) => {
        state.selectedChat?.lastMessages.push(...action.payload.messages);
        state.isLoadingMessages = false;
      })
      .addCase(fetchMessages.rejected, (state: ChatSchema) => {
        state.isLoadingMessages = false;
      });
  }
});

export const { actions: chatActions } = chatSlice;
export const { reducer: chatReducer } = chatSlice;
