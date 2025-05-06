import { StateSchema } from '@/app/providers/store-provider';

export const getTeamSelectedTeam = (state: StateSchema) => state?.team?.selectedTeam;
