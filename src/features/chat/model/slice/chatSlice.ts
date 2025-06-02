import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatSchema } from '../types/chat.ts';
import { ChatInfo } from '../types/chatInfo.ts';
import { fetchChats } from '../service/fetchChats.ts';
import { fetchMessages } from '../service/fetchMessages.ts';
import { Message } from '../types/message.ts';
import { ChatTypes } from '../types/chatTypes.ts';

const initialState: ChatSchema = {
  dialogs: [],
  isLoadingDialogs: false,
  selectedChat: undefined,
  isLoadingSelectedChat: false,
  isActiveInfoPanel: false,
  isLoadingMessages: false,
  messageDrafts: {},
  editableMessage: undefined,
  dialogsFilter: ChatTypes.ALL
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
    },
    editMessage: (state, action: PayloadAction<Message>) => {
      const editedMessage = action.payload;

      const chatIndex = state.dialogs.findIndex((dialog) => dialog.chatId === editedMessage.chatId);
      if (chatIndex !== -1) {
        const chat = state.dialogs[chatIndex];
        if (chat?.lastMessage?.messageId === editedMessage.messageId) {
          chat.lastMessage = editedMessage;
        }
      }
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.dialogs.unshift(action.payload);
    },
    deleteChatById: (state, action: PayloadAction<string>) => {
      state.dialogs = state.dialogs.filter((dialog) => dialog.chatId !== action.payload);
    },
    setIsActiveInfoPanel: (state, action: PayloadAction<boolean>) => {
      state.isActiveInfoPanel = action.payload;
    },
    setMessageDraft(state, action: PayloadAction<{ chatId: string; message: string }>) {
      state.messageDrafts[action.payload.chatId] = action.payload.message;
    },
    setEditableMessage: (state, action: PayloadAction<Message | undefined>) => {
      state.editableMessage = action.payload;
    },
    setDialogsFilter: (state, action: PayloadAction<ChatTypes>) => {
      state.dialogsFilter = action.payload;
    },
    setIsLoadingSelectedChat: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSelectedChat = action.payload;
    }
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
      .addCase(fetchMessages.pending, (state: ChatSchema) => {
        state.isLoadingMessages = true;
      })
      .addCase(fetchMessages.fulfilled, (state: ChatSchema) => {
        state.isLoadingMessages = false;
      })
      .addCase(fetchMessages.rejected, (state: ChatSchema) => {
        state.isLoadingMessages = false;
      });
  }
});

export const { actions: chatActions } = chatSlice;
export const { reducer: chatReducer } = chatSlice;
