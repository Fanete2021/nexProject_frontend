import { createAsyncThunk } from '@reduxjs/toolkit';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { ThunkConfig } from '@/app/providers/store-provider';

interface RegistrationProps {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export const registration = createAsyncThunk<void, RegistrationProps, ThunkConfig<string>> (
    'registration/registration',
    async (registrationData, thunkAPI) => {
        const {
            extra,
            rejectWithValue
        } = thunkAPI;

        try {
            const response = await extra.api.post('/auth/signup', registrationData);

            extra.navigate?.(RoutePath.auth);
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
