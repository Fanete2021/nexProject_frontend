import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserSchema } from '../types/user.ts';
import { fetchUserData } from '@/entities/user';

const initialState: UserSchema = {
    data: undefined,
    isLoading: false
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<User>) => {
            state.data = action.payload;
        },
        resetData: (state) => {
            state.data = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state: UserSchema) => {
                state.isLoading = true;
            })
            .addCase(fetchUserData.fulfilled, (state: UserSchema, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchUserData.rejected, (state: UserSchema) => {
                state.isLoading = false;
            });
    }
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
