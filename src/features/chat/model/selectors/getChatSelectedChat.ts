import { StateSchema } from '@/app/providers/store-provider';

export const getChatSelectedChat = (state: StateSchema) => state.chat.selectedChat;
