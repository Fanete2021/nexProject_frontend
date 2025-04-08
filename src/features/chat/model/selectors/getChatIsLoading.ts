import { StateSchema } from '@/app/providers/store-provider';

export const getChatIsLoading = (state: StateSchema) => state.chat.isLoading;
