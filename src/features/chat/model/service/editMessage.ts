import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

interface EditMessageProps {
  chatId: string;
  messageId: string;
  newMessage: string;
}

export const editMessage = createAsyncThunk<void, EditMessageProps, ThunkConfig<string>> (
  'chat/editMessage',
  async (editMessageData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.put('/message/edit', editMessageData);

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
