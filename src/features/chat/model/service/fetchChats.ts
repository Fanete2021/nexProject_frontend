import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Chat } from '../../model/types/chat.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';

interface FetchChatsResponse {
  chats: Chat[];
}

interface FetchChatsProps {
    filterMode: ChatTypes;
}

export const fetchChats = createAsyncThunk<FetchChatsResponse, FetchChatsProps, ThunkConfig<string>> (
  'chat/fetchChats',
  async (fetchChatsData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/getChats', {
        params: {
          pageNumber: 1,
          pageSize: 15,
          filterMode: fetchChatsData.filterMode,
          getLastMess: true
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
