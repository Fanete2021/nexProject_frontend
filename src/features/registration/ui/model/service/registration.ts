import { createAsyncThunk } from '@reduxjs/toolkit';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import { ThunkConfig } from '@/app/providers/store-provider';
import {User, userActions} from "@/entities/user";
import {authActions} from "@/features/auth";

interface RegistrationProps {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface RegistrationResponse {
    jwtToken: string;
    user: User;
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

            dispatch(authActions.setToken(response.data.jwtToken));
            dispatch(userActions.setData(response.data.user));

            extra.navigate?.(RoutePath.emailConfirm);

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
