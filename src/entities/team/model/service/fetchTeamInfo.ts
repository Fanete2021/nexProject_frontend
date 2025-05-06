import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TeamInfo } from '../types/teamInfo.ts';

export interface FetchTeamInfoProps {
  teamId: string;
}

export const fetchTeamInfo = createAsyncThunk<TeamInfo, FetchTeamInfoProps, ThunkConfig<string>> (
  'team/fetchTeamInfo',
  async (fetchTeamInfoData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/getTeam', {
        params: fetchTeamInfoData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
