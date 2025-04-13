import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Contact } from '../../model/types/contact.ts';

interface CreateGroupProps {
  chatName: string;
  memberIds: string[];
  topicNames?: string[];
}

export const createGroup = createAsyncThunk<void, CreateGroupProps, ThunkConfig<string>> (
  'chat/createGroup',
  async (createGroupData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.post('/multi/createChat', createGroupData);

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
