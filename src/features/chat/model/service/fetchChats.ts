import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Chat } from '../../model/types/chat.ts';

interface FetchChatsResponse {
  chats: Chat[];
}

export const fetchChats = createAsyncThunk<FetchChatsResponse, void, ThunkConfig<string>> (
    'chat/fetchChats',
    async (_, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
        } = thunkAPI;

        try {
            const response = await extra.api.get('/getChats');

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
