import { TeamTag } from './teamTag.ts';
import { TeamMember } from './teamMember.ts';
import { Team } from './team.ts';

export interface TeamInfo extends Omit<Team, 'role'> {
  organizationName: string;
  teamDescription: string;
  teamManagerId: string;
  teamManagerName: string;
  teamTags: TeamTag[];
  teamMembers: TeamMember[];
}
