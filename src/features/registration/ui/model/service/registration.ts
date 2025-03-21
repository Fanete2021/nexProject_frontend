import { createAsyncThunk } from '@reduxjs/toolkit';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { ThunkConfig } from '@/app/providers/store-provider';
import { fetchUserData } from '@/entities/user';
import { authActions } from '@/features/auth';

interface RegistrationProps {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface RegistrationResponse {
    access_token: string;
}

export const registration = createAsyncThunk<RegistrationResponse, RegistrationProps, ThunkConfig<string>> (
    'registration/registration',
    async (registrationData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
            dispatch
        } = thunkAPI;

        try {
            const response = await extra.api.post('/auth/signup', registrationData);

            await dispatch(authActions.setToken(response.data.access_token));

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
