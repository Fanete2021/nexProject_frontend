import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TeamRoles } from '../types/teamRoles.ts';
import { TeamInfo } from '../types/teamInfo.ts';

interface EditRoleInTeamProps {
  teamId: string;
  members: {
    userId: string;
    role: TeamRoles;
  };
}

export const editRoleInTeam = createAsyncThunk<TeamInfo, EditRoleInTeamProps, ThunkConfig<string>> (
  'team/editRoleInTeam',
  async (editRoleInTeamData, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    try {
      const response = await extra.api.put('/team/editMembersRoles', editRoleInTeamData, {
        params: {
          teamId: editRoleInTeamData.teamId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
