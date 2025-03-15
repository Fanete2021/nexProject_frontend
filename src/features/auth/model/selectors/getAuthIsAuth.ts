import { StateSchema } from '@/app/providers/store-provider';

export const getAuthIsAuth = (state: StateSchema) => state?.auth?.isAuth;
