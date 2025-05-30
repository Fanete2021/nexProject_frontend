import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Organization } from '../types/organization.ts';

interface CreateOrganizationProps {
  orgName: string;
  orgDescription?: string;
}

export const createOrganization = createAsyncThunk<Organization, CreateOrganizationProps, ThunkConfig<string>> (
  'organization/createOrganization',
  async (createOrganizationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      if (!createOrganizationData.orgDescription) delete createOrganizationData.orgDescription;

      const response = await extra.api.post('/org/create', createOrganizationData);

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
