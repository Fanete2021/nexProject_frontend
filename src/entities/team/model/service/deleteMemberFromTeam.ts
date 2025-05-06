import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { teamActions } from '../slice/teamSlice';

interface DeleteMemberFromTeamProps {
  teamId: string;
  userId: string;
}

export const deleteMemberFromTeam = createAsyncThunk<void, DeleteMemberFromTeamProps, ThunkConfig<string>> (
  'team/deleteMemberFromTeam',
  async (deleteMemberFromTeamData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
      dispatch
    } = thunkAPI;

    try {
      const response = await extra.api.delete('/team/deleteMember', { params: deleteMemberFromTeamData });

      await dispatch(
        teamActions.removeMemberFromSelectedTeamById(deleteMemberFromTeamData.userId)
      );

      return response;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
