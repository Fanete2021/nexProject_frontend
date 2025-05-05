import { OrganizationRoles } from '../../model/types/organizationRoles.ts';
import { OrganizationInfo } from '../../model/types/organizationInfo.ts';
import { User } from '@/entities/user';

export const getMyRole = (organization: OrganizationInfo, user: User): OrganizationRoles => {
  return organization.members.find(m => m.userId === user.userId)!.role;
};
