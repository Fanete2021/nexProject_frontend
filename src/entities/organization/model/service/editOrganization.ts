import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { OrganizationInfo } from '../../index.ts';

interface EditOrganizationProps {
  organizationId: string;
  organizationName: string;
  organizationDescription: string;
}

export const editOrganization = createAsyncThunk<
  OrganizationInfo,
  EditOrganizationProps,
  ThunkConfig<string>
> (
  'organization/editOrganizationData',
  async (editRoleInOrganizationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    if (!editRoleInOrganizationData.organizationDescription) delete editRoleInOrganizationData.organizationDescription;

    try {
      const response = await extra.api.put('/org/edit', editRoleInOrganizationData, {
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
