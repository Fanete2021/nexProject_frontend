import { createAsyncThunk } from '@reduxjs/toolkit';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { ThunkConfig } from '@/app/providers/store-provider';

interface LoginProps {
  phoneNumberOrMail: string;
  password: string;
}

export const login = createAsyncThunk<void, LoginProps, ThunkConfig<string>> (
    'auth/login',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue
        } = thunkAPI;

        try {
            const response = await extra.api.post('/auth/signin', authData);

            extra.navigate?.(RoutePath.main);
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
