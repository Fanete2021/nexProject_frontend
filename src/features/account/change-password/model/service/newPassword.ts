import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { ApiError } from '@/shared/types/apiError.ts';

interface NewPasswordProps {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export const newPassword = createAsyncThunk<void, NewPasswordProps, ThunkConfig<ApiError>> (
  'changePassword/newPassword',
  async ({ token, ...changePasswordData }, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;
    try {
      const response = await extra.api.post(`/newPassword/${token}`, changePasswordData);

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
