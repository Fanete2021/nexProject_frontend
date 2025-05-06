import { TeamRoles } from './teamRoles.ts';

export interface TeamMember {
  userId: string;
  username: string;
  name: string;
  email: string;
  role: TeamRoles;
}
