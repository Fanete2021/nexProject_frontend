import { TeamRoles } from '../../model/types/teamRoles.ts';

export const getRoleName = (role: TeamRoles) => {
  switch (role) {
    case TeamRoles.OWNER:
      return 'владелец';
    case TeamRoles.ADMIN:
      return 'админ';
    case TeamRoles.EDITOR:
      return 'редактор';
    case TeamRoles.VIEWER:
      return 'участник';
    default:
      return '';
  }
};
