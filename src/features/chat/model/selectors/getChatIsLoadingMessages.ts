import { StateSchema } from '@/app/providers/store-provider';

export const getChatIsLoadingMessages = (state: StateSchema) => state.chat.isLoadingMessages;
