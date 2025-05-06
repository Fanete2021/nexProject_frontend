import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Team } from '../types/team.ts';

export const fetchMyTeams = createAsyncThunk<Team[], void, ThunkConfig<string>> (
  'team/fetchMyTeams',
  async (_, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/getTeams');

      const { userOrganizations } = response.data;

      const result: Team[] = userOrganizations.flatMap(org =>
        org.organizationTeams.map(team => ({
          teamId: team.teamId,
          organizationId: org.organizationId,
          teamName: team.teamName,
          role: team.role
        }))
      );

      console.log(userOrganizations, result)

      return result;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
