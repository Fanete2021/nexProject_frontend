import { StateSchema } from '@/app/providers/store-provider';

export const getTeamData = (state: StateSchema) => state?.team?.data;
