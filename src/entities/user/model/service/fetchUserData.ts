import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { User } from '@/entities/user';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { sendCode } from '@/features/confirm-email';

export const fetchUserData = createAsyncThunk<User, void, ThunkConfig<string>> (
  'user/fetchUserData',
  async (_, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/user');

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
