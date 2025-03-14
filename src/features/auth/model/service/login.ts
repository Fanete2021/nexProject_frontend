import { createAsyncThunk } from '@reduxjs/toolkit';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { ThunkConfig } from '@/app/providers/store-provider';
import {authActions} from "@/features/auth";

interface LoginProps {
  phoneNumberOrMail: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
    jwtToken: string;
}

export const login = createAsyncThunk<LoginResponse, LoginProps, ThunkConfig<string>> (
    'auth/login',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue
        } = thunkAPI;

        try {
            const response = await extra.api.post('/auth/signin', authData);

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
