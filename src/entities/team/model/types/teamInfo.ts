import { TeamTag } from './teamTag.ts';
import { TeamMember } from './teamMember.ts';

export interface TeamInfo {
  teamId: string;
  organizationId: string;
  organizationName: string;
  teamName: string;
  teamDescription: string;
  teamManagerId: string;
  teamManagerName: string;
  teamTags: TeamTag[];
  teamMembers: TeamMember[];
}
