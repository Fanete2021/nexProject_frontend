import { TeamRoles } from '../../model/types/teamRoles.ts';

export const isOwner = (role: TeamRoles): boolean => {
  return role === TeamRoles.OWNER;
};
