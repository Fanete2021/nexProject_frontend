import { StateSchema } from '@/app/providers/store-provider';

export const getChatMessageDrafts = (state: StateSchema) => state.chat.messageDrafts;
