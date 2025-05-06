import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { OrganizationRoles } from '../types/organizationRoles.ts';
import { OrganizationInfo } from '../types/organizationInfo.ts';

interface AddMembersToOrganizationProps {
  organizationId: string;
  members: {
    userId: string;
    role: OrganizationRoles;
  };
}

export const addMembersToOrganization = createAsyncThunk<OrganizationInfo, AddMembersToOrganizationProps, ThunkConfig<string>> (
  'organization/addMembersToOrganization',
  async (addMembersToOrganizationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    try {
      const response = await extra.api.post('/org/addMembers', addMembersToOrganizationData, {
        params: {
          organizationId: addMembersToOrganizationData.organizationId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
