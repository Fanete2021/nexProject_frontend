import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Contact } from '../../model/types/contact.ts';

export const fetchMyContacts = createAsyncThunk<Contact[], void, ThunkConfig<string>> (
  'chat/fetchMyContacts',
  async (_, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get(`/chat/getInterlocutors`, {
        params: {
          pageNumber: 1,
          pageSize: 10,
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
