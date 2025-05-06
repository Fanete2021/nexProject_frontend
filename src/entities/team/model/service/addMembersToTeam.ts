import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TeamRoles } from '../types/teamRoles.ts';
import { TeamInfo } from '../types/teamInfo.ts';

interface AddMembersToTeamProps {
  teamId: string;
  members: {
    userId: string;
    role: TeamRoles;
  };
}

export const addMembersToTeam = createAsyncThunk<TeamInfo, AddMembersToTeamProps, ThunkConfig<string>> (
  'team/addMembersToTeam',
  async (addMembersToTeamData, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    try {
      const response = await extra.api.post('/team/addMembers', addMembersToTeamData, {
        params: {
          teamId: addMembersToTeamData.teamId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
