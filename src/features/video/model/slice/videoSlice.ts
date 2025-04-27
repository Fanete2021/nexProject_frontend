import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoSchema } from '../types/videoSchema.ts';

const initialState: VideoSchema = {
  roomId: undefined,
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    resetRoomId: (state) => {
      state.roomId = undefined;
    }
  },
});

export const { actions: videoActions } = videoSlice;
export const { reducer: videoReducer } = videoSlice;
