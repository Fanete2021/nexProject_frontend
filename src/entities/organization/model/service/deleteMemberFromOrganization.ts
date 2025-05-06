import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { organizationActions } from '../slice/organizationSlice.ts';

interface DeleteMemberFromOrganizationProps {
  organizationId: string;
  userId: string;
}

export const deleteMemberFromOrganization = createAsyncThunk<void, DeleteMemberFromOrganizationProps, ThunkConfig<string>> (
  'organization/deleteMemberFromOrganization',
  async (deleteMemberFromOrganizationData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
      dispatch
    } = thunkAPI;

    try {
      const response = await extra.api.delete('/org/deleteMember', { params: deleteMemberFromOrganizationData });

      await dispatch(
        organizationActions.removeMemberFromSelectedOrganizationById(deleteMemberFromOrganizationData.userId)
      );

      return response;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
