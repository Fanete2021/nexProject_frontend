import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { authActions } from '../slice/authSlice.ts';
import { userActions } from '@/entities/user';
import {RoutePath} from "@/shared/config/routeConfig/routeConfig.tsx";

export const logout = createAsyncThunk<void, void, ThunkConfig<string>> (
  'auth/logout',
  async (authData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
      dispatch,
    } = thunkAPI;

    try {
      const response = await extra.api.post('/auth/logout', null, {
        withCredentials: true
      });

      extra.navigate(RoutePath.auth);
      await dispatch(authActions.resetToken());
      await dispatch(userActions.resetData());

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
