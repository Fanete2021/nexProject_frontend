import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Organization } from '../types/organization.ts';

export const fetchMyOrganizations = createAsyncThunk<Organization[], void, ThunkConfig<string>> (
  'organization/fetchOrganizations',
  async (_, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    try {
      const response = await extra.api.get('/org/getOrgs');

      const { organizations } = response.data;

      return organizations;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
