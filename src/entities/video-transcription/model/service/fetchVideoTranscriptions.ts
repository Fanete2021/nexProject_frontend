import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { VideoTranscription } from '../types/videoTranscription.ts';

export interface FetchVideoTranscriptionsProps {
  chatId: string;
}

export const fetchVideoTranscriptions = createAsyncThunk<VideoTranscription[], FetchVideoTranscriptionsProps, ThunkConfig<string>> (
  'videoTranscription/fetchVideoTranscriptions',
  async (fetchVideoTranscriptionsData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/summarize/getAll', {
        params: fetchVideoTranscriptionsData
      });

      return response.data.summarizations;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
