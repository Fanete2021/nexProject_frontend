import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { ApiError } from '@/shared/types/apiError.ts';
import { authActions } from '@/features/account/auth';

interface RegistrationProps {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface RegistrationResponse {
    access_token: string;
}

export const registration = createAsyncThunk<RegistrationResponse, RegistrationProps, ThunkConfig<ApiError>> (
  'registration/registration',
  async (registrationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
      dispatch
    } = thunkAPI;

    try {
      const response = await extra.api.post('/auth/signup', registrationData, {
        withCredentials: true
      });

      await dispatch(authActions.setToken(response.data.access_token));

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
