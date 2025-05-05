import { OrganizationRoles } from '../../model/types/organizationRoles.ts';

export const isAdmin = (role: OrganizationRoles): boolean => {
  return role === OrganizationRoles.OWNER || role === OrganizationRoles.ADMIN;
};
