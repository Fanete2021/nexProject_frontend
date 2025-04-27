import { VideoSchema } from './model/types/videoSchema.ts';
import { videoReducer, videoActions } from './model/slice/videoSlice.ts';
import { getVideoRoomId } from './model/selectors/getVideoRoomId.ts';
import VideoCallModal from './ui/video-call-modal/VideoCallModal.tsx';

export type {
  VideoSchema,
};

export {
  videoReducer,
  videoActions,

  getVideoRoomId,

  VideoCallModal
};
