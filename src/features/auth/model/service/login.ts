import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { fetchUserData } from '@/entities/user';
import { authActions } from '@/features/auth';
import { ApiError } from '@/shared/types/apiError.ts';

interface LoginProps {
  phoneNumberOrMail: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  access_token: string;
}

export const login = createAsyncThunk<LoginResponse, LoginProps, ThunkConfig<ApiError>> (
    'auth/login',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
            dispatch
        } = thunkAPI;

        try {
            const response = await extra.api.post('/auth/signin', authData, {
                withCredentials: true
            });

            await dispatch(authActions.setToken(response.data.access_token));
            await dispatch(fetchUserData());

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    }
);
