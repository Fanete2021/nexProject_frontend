import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { authActions } from '../slice/authSlice.ts';
import { userActions } from '@/entities/user';

export const logout = createAsyncThunk<void, void, ThunkConfig<string>> (
    'auth/logout',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
            dispatch
        } = thunkAPI;

        try {
            const response = await extra.api.post('/logout', null, {
                withCredentials: true
            });

            await dispatch(authActions.resetToken());
            await dispatch(userActions.resetData());

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
