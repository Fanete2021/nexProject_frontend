import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserSchema } from '../types/user.ts';

const initialState: UserSchema = {
    data: undefined,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<User>) => {
            state.readonly = action.payload;
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
