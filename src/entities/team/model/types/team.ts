import { TeamInfo } from './teamInfo.ts';
import { TeamRoles } from './teamRoles.ts';

export interface Team {
  teamId: string;
  organizationId: string;
  teamName: string;
  role: TeamRoles;
}

export interface TeamSchema {
  data?: Team[];
  selectedTeam?: TeamInfo;
  isLoading: boolean;
}
