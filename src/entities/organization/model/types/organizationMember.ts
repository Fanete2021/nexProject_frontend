import { OrganizationRoles } from './organizationRoles.ts';

export interface OrganizationMember {
  userId: string;
  role: OrganizationRoles;
  email: string;
  name: string;
  username: string;
}
