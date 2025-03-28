import { StateSchema } from '@/app/providers/store-provider';

export const getAuthIsLoading = (state: StateSchema) => state?.auth?.isLoading;
