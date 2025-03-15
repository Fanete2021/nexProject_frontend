import { StateSchema } from '@/app/providers/store-provider';

export const getUserData = (state: StateSchema) => state?.user?.data;
