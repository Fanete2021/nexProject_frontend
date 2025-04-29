import { VideoSchema } from './model/types/videoSchema.ts';
import { videoReducer, videoActions } from './model/slice/videoSlice.ts';
import { getVideoRoomId } from './model/selectors/getVideoRoomId.ts';
import VideoCallModal from './ui/video-call-modal/VideoCallModal.tsx';
import { participant } from './model/types/participant.ts';

export type {
  VideoSchema,
  participant
};

export {
  videoReducer,
  videoActions,

  getVideoRoomId,

  VideoCallModal
};
