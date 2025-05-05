import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { OrganizationInfo } from '../types/organizationInfo.ts';

export interface FetchOrganizationInfoProps {
  organizationId: string;
}

export const fetchOrganizationInfo = createAsyncThunk<OrganizationInfo, FetchOrganizationInfoProps, ThunkConfig<string>> (
  'organization/fetchOrganizationInfo',
  async (fetchOrganizationInfoData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/org/getOrganization', {
        params: fetchOrganizationInfoData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
