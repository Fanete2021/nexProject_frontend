import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { authActions } from '../slice/authSlice.ts';

interface RefreshTokenResponse {
  access_token: string;
}

export const refreshToken = createAsyncThunk<RefreshTokenResponse, void, ThunkConfig<string>> (
  'auth/refreshToken',
  async (_, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
      dispatch
    } = thunkAPI;

    try {
      const response = await extra.api.post('/auth/refresh-token', null, {
        withCredentials: true,
        headers: {}
      });

      await dispatch(authActions.setToken(response.data.access_token));

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
