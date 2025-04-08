import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatSchema } from '../types/chat.ts';
import { fetchChats } from '../service/fetchChats.ts';
import { fetchSelectedChatInfo } from '../service/fetchSelectedChatInfo.ts';

const initialState: ChatSchema = {
    data: [],
    isLoading: false,
    selectedChat: undefined
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Chat[]>) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state: ChatSchema) => {
                state.isLoading = true;
            })
            .addCase(fetchChats.fulfilled, (state: ChatSchema, action) => {
                state.data = action.payload.chats;
                state.isLoading = false;
            })
            .addCase(fetchChats.rejected, (state: ChatSchema) => {
                state.isLoading = false;
            })
            .addCase(fetchSelectedChatInfo.pending, (state: ChatSchema) => {
                state.isLoading = true;
            })
            .addCase(fetchSelectedChatInfo.fulfilled, (state: ChatSchema, action) => {
                state.selectedChat = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchSelectedChatInfo.rejected, (state: ChatSchema) => {
                state.isLoading = false;
            });
    }
});

export const { actions: chatActions } = chatSlice;
export const { reducer: chatReducer } = chatSlice;
