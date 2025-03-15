import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

interface ConfirmEmailProps {
    code: string;
}

export const confirmEmail = createAsyncThunk<void, ConfirmEmailProps, ThunkConfig<string>> (
    'confirmEmail/confirmEmail',
    async (confirmEmailData, thunkAPI) => {
        const {
            extra,
            rejectWithValue
        } = thunkAPI;

        try {

            const response = await extra.api.post('/auth/signup/confirm', confirmEmailData);

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
