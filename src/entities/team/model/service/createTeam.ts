import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Team } from '../types/team.ts';
import { ApiError } from '@/shared/types/apiError.ts';

interface CreateTeamProps {
  organizationId: string;
  teamName: string;
}

export const createTeam = createAsyncThunk<Team, CreateTeamProps, ThunkConfig<ApiError>> (
  'team/createTeam',
  async (createTeamData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.post('/team/create', createTeamData, {
        params: {
          organizationId: createTeamData.organizationId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
