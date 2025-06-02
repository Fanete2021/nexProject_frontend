import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

export interface DeleteMessageProps {
  chatId: string;
  messageId: string;
}

export const deleteMessage = createAsyncThunk<void, DeleteMessageProps, ThunkConfig<string>> (
  'chat/deleteMessage',
  async (deleteMessageData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.delete('/message/delete', {
        params: deleteMessageData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
