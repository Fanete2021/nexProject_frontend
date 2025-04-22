import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Contact } from '../types/contact.ts';

interface FetchInterlocutorsProps {
}

export const fetchInterlocutors = createAsyncThunk<
  Contact[],
  FetchInterlocutorsProps,
  ThunkConfig<string>
> (
  'contact/fetchInterlocutors',
  async (_, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/chat/getInterlocutors', {
        params: {
          pageNumber: 1,
          pageSize: 9999, //TODO заменить потом на пагинацию
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
