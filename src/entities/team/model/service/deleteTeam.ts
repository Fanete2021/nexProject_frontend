import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Team } from '../types/team.ts';
import { ApiError } from '@/shared/types/apiError.ts';

interface DeleteTeamProps {
  teamId: string;
}

export const deleteTeam = createAsyncThunk<Team, DeleteTeamProps, ThunkConfig<ApiError>> (
  'team/deleteTeam',
  async (deleteTeamData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.delete('/team/delete', {
        params: {
          teamId: deleteTeamData.teamId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
