import { StateSchema } from '@/app/providers/store-provider';

export const getChatIsLoadingSelectedChat = (state: StateSchema) => state.chat.isLoadingSelectedChat;
