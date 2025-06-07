import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

interface DeleteMemberFromOrganizationProps {
  organizationId: string;
  userId: string;
}

export const deleteMemberFromOrganization = createAsyncThunk<
  void,
  DeleteMemberFromOrganizationProps,
  ThunkConfig<string>
> (
  'organization/deleteMemberFromOrganization',
  async (deleteMemberFromOrganizationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    try {
      const response = await extra.api.delete('/org/deleteMember', { params: deleteMemberFromOrganizationData });

      return response;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

