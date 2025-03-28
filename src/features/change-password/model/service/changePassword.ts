import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { ApiError } from '@/shared/types/apiError.ts';

interface ChangePasswordProps {
    email: string;
}

export const changePassword = createAsyncThunk<void, ChangePasswordProps, ThunkConfig<ApiError>> (
    'changePassword/changePassword',
    async (changePasswordData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
        } = thunkAPI;

        try {
            const response = await extra.api.post('/newPassword', changePasswordData);

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    }
);
