import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { OrganizationRoles } from '../types/organizationRoles.ts';
import { OrganizationInfo } from '../../index.ts';

interface EditRoleInOrganizationProps {
  organizationId: string;
  members: {
    userId: string;
    role: OrganizationRoles
  }[];
}

export const editRoleInOrganization = createAsyncThunk<
  OrganizationInfo,
  EditRoleInOrganizationProps,
  ThunkConfig<string>
> (
  'organization/editRoleInOrganization',
  async (editRoleInOrganizationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.put('/org/editRoles', editRoleInOrganizationData, {
        params: {
          organizationId: editRoleInOrganizationData.organizationId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
