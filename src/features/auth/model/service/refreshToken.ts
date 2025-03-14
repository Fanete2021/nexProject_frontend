import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { authActions } from '@/features/auth';

interface RefreshTokenResponse {
    jwtToken: string;
}

export const refreshToken = createAsyncThunk<RefreshTokenResponse, void, ThunkConfig<string>> (
    'auth/refreshToken',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue
        } = thunkAPI;

        try {
            const response = await extra.api.post('/auth/refresh-token');

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
