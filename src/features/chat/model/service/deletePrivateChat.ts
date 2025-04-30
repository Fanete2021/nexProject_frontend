import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { chatActions } from '../slice/chatSlice.ts';

interface DeletePrivateChatProps {
  chatId: string;
}

export const deletePrivateChat = createAsyncThunk<void, DeletePrivateChatProps, ThunkConfig<string>> (
  'chat/deletePrivateChat',
  async (deletePrivateChatData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
      dispatch
    } = thunkAPI;

    try {
      const response = await extra.api.delete('/deleteChat', {
        params: deletePrivateChatData
      });
      
      dispatch(chatActions.deleteChatById(deletePrivateChatData.chatId));

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
