import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import {User, userActions} from "@/entities/user";

interface LoginProps {
  phoneNumberOrMail: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
    jwtToken: string;
    user: User;
}

export const login = createAsyncThunk<LoginResponse, LoginProps, ThunkConfig<string>> (
    'auth/login',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
            dispatch
        } = thunkAPI;

        try {
            const response = await extra.api.post('/auth/signin', authData);

            dispatch(userActions.setData(response.data.user));

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
