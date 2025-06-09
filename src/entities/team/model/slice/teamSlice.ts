import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamSchema } from '../types/team';
import { createTeam } from '../service/createTeam.ts';
import { fetchMyTeams } from '../service/fetchMyTeams.ts';

const initialState: TeamSchema = {
  data: undefined,
  isLoading: false,
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Team[]>) => {
      state.data = action.payload;
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      if (!state.data) return;

      state.data = state.data.map(team =>
        team.teamId === action.payload.teamId ? action.payload : team
      );
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data = state.data.filter(team => team.teamId !== action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.fulfilled, (state: TeamSchema, action) => {
        if (!state.data) {
          state.data = [];
        }

        state.data.push(action.payload);
      })
      .addCase(fetchMyTeams.pending, (state: TeamSchema) => {
        state.isLoading = true;
      })
      .addCase(fetchMyTeams.fulfilled, (state: TeamSchema, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyTeams.rejected, (state: TeamSchema) => {
        state.isLoading = false;
      });
  }
});

export const { actions: teamActions } = teamSlice;
export const { reducer: teamReducer } = teamSlice;
