import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

interface AddUserToGroupProps {
  chatId: string;
  memberIds: string[];
}

export const addUserToGroup = createAsyncThunk<void, AddUserToGroupProps, ThunkConfig<string>> (
  'chat/addUserToGroup',
  async (addUserToGroupData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.post('/multi/addUser', addUserToGroupData);

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
