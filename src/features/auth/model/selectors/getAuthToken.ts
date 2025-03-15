import { StateSchema } from '@/app/providers/store-provider';

export const getAuthToken = (state: StateSchema) => state?.auth?.token;
