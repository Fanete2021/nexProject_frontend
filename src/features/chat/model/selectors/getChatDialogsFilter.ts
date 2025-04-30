import { StateSchema } from '@/app/providers/store-provider';

export const getChatDialogsFilter = (state: StateSchema) => state.chat.dialogsFilter;
