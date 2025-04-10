import { StateSchema } from '@/app/providers/store-provider';

export const getChatIsLoadingDialogs = (state: StateSchema) => state.chat.isLoadingDialogs;
