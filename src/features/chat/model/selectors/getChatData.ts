import { StateSchema } from '@/app/providers/store-provider';

export const getChatData = (state: StateSchema) => state.chat.data;
