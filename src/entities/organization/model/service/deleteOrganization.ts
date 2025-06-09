import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Team } from '../types/team.ts';
import { ApiError } from '@/shared/types/apiError.ts';

interface DeleteOrganizationProps {
  organizationId: string;
}

export const deleteOrganization = createAsyncThunk<Team, DeleteOrganizationProps, ThunkConfig<ApiError>> (
  'organization/deleteOrganization',
  async (deleteOrganizationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.delete('/org/delete', {
        params: {
          organizationId: deleteOrganizationData.organizationId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
