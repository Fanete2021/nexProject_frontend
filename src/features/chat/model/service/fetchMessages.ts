import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Message } from '../types/message.ts';

interface FetchMessageResponse {
  messages: Message[],
}

interface FetchMessagesProps {
  chatId: string;
  pageNumber: number;
  pageSize: number;
  topicId?: number;
}

export const fetchMessages = createAsyncThunk<
  FetchMessageResponse,
  FetchMessagesProps,
  ThunkConfig<string>
> (
  'chat/fetchMessages',
  async (fetchMessagesData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    const { topicId = 0, ...props } = fetchMessagesData;

    try {
      const response = await extra.api.get('/getMessages', {
        params: {
          topicId,
          ...props
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
