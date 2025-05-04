import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../types/authSchema.ts';
import { login } from '../service/login.ts';

const initialState: AuthSchema = {
  isAuth: false,
  token: '',
  isLoading: false,
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
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state: AuthSchema) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state: AuthSchema) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state: AuthSchema) => {
        state.isLoading = false;
      });
  }
});

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;
