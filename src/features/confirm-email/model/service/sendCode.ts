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
            //TODO поменять на post
            const response = await extra.api.get('/confirm/sendCode');
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
