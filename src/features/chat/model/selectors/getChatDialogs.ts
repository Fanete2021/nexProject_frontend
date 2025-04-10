import { StateSchema } from '@/app/providers/store-provider';

export const getChatDialogs = (state: StateSchema) => state.chat.dialogs;
