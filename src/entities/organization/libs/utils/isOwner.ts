import { OrganizationRoles } from '../../model/types/organizationRoles.ts';

export const isOwner = (role: OrganizationRoles): boolean => {
  return role === OrganizationRoles.OWNER;
};
