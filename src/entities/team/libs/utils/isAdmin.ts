import { TeamRoles } from '../../model/types/teamRoles.ts';

export const isAdmin = (role: TeamRoles): boolean => {
  return role === TeamRoles.OWNER || role === TeamRoles.ADMIN;
};
