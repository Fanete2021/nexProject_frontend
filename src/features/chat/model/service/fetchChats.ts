import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Chat } from '../../model/types/chat.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';

interface FetchChatsResponse {
  chats: Chat[];
}

interface FetchChatsProps {
  filterMode: ChatTypes;
  getLastMess?: boolean;
  pageSize?: number;
  pageNumber?: number;
}

export const fetchChats = createAsyncThunk<FetchChatsResponse, FetchChatsProps, ThunkConfig<string>> (
  'chat/fetchChats',
  async (fetchChatsData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    const { filterMode, getLastMess = true, pageSize = 15, pageNumber = 1 } = fetchChatsData;

    try {
      const response = await extra.api.get('/getChats', {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          filterMode,
          getLastMess
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
