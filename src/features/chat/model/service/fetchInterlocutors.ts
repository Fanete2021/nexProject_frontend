import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Chat } from '../../model/types/chat.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';

interface FetchInterlocutorsResponse {
  chats: Chat[];
}

interface FetchInterlocutorsProps {
}

export const fetchInterlocutors = createAsyncThunk<
  FetchInterlocutorsResponse,
  FetchInterlocutorsProps,
  ThunkConfig<string>
> (
  'chat/fetchInterlocutors',
  async (_, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/chat/getInterlocutors', {
        params: {
          pageNumber: 1,
          pageSize: 15,
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
