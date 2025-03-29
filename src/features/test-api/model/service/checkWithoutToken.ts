import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { ApiError } from '@/shared/types/apiError.ts';

interface RefreshTokenResponse {
    access_token: string;
}

export const checkWithoutToken = createAsyncThunk<RefreshTokenResponse, void, ThunkConfig<ApiError>> (
    'testApi/checkWithoutToken',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
        } = thunkAPI;

        try {
            const response = await extra.api.get('/test/checkWithOutToken');

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    }
);
