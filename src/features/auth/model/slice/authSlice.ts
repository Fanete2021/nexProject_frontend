import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../types/authSchema.ts';

const initialState: AuthSchema = {
    isAuth: false,
    token: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuth = true;
        },
        resetToken: (state) => {
            state.token = '';
            state.isAuth = false;
        }
    },
});

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;
