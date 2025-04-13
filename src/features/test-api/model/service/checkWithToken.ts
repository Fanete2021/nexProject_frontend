import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { ApiError } from '@/shared/types/apiError.ts';

interface RefreshTokenResponse {
  access_token: string;
}

export const checkWithToken = createAsyncThunk<RefreshTokenResponse, void, ThunkConfig<ApiError>> (
  'testApi/checkWithToken',
  async (authData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/test/checkWithToken');

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
