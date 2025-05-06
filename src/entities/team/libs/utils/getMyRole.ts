import { User } from '@/entities/user';
import { TeamInfo } from '../../model/types/teamInfo';
import { TeamRoles } from '../../model/types/teamRoles';

export const getMyRole = (team: TeamInfo, user: User): TeamRoles => {
  return team.teamMembers.find(m => m.userId === user.userId)!.role;
};
