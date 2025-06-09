import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TeamInfo } from '../types/teamInfo.ts';
import { TeamTag } from '../types/teamTag.ts';
import { ApiError } from '@/shared/types/apiError.ts';

interface EditTeamProps {
  teamId: string;
  newTeamName: string;
  newTeamDescription: string;
  newTeamTags?: TeamTag[];
}

export const editTeam = createAsyncThunk<TeamInfo, EditTeamProps, ThunkConfig<ApiError>> (
  'team/editTeam',
  async (editTeamData, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    if (!editTeamData.newTeamDescription) delete editTeamData.newTeamDescription;
    if (!editTeamData.newTeamTags) delete editTeamData.newTeamTags;

    try {
      const response = await extra.api.put('/team/editInfo', editTeamData, {
        params: {
          teamId: editTeamData.teamId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
