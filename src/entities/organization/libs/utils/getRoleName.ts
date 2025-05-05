import { OrganizationRoles } from '../../model/types/organizationRoles.ts';

export const getRoleName = (role: OrganizationRoles) => {
  switch (role) {
    case OrganizationRoles.OWNER:
      return 'владелец';
    case OrganizationRoles.ADMIN:
      return 'админ';
    case OrganizationRoles.EDITOR:
      return 'редактор';
    case OrganizationRoles.VIEWER:
      return 'участник';
    default:
      return '';
  }
};
