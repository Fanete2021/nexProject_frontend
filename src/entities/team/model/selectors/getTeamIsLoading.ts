import { StateSchema } from '@/app/providers/store-provider';

export const getTeamIsLoading = (state: StateSchema) => state?.team?.isLoading;
