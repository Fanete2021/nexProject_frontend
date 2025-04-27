import { StateSchema } from '@/app/providers/store-provider';

export const getVideoRoomId = (state: StateSchema) => state?.video?.roomId;
