import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { ChatInfo } from '../types/chatInfo.ts';
import ChatWebSocketService from "./ChatWebSocketService.ts";

interface FetchChatInfoProps {
  chatId: string;
}

export const fetchSelectedChatInfo = createAsyncThunk<ChatInfo, FetchChatInfoProps, ThunkConfig<string>> (
    'chat/fetchSelectedChatInfo',
    async (chatInfoData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
        } = thunkAPI;

        try {
            const response = await extra.api.get(`/chatInfo/${chatInfoData.chatId}`);


            ChatWebSocketService.subscribe(chatInfoData.chatId);

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
