import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

export const sendCode = createAsyncThunk<void, void, ThunkConfig<string>> (
    'confirmEmail/sendCode',
    async (confirmEmailData, thunkAPI) => {
        const {
            extra,
            rejectWithValue
        } = thunkAPI;

        try {
            const response = await extra.api.post('/confirm/sendCode');
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
