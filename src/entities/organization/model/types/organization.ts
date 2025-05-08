import { OrganizationRoles } from './organizationRoles.ts';
import { OrganizationInfo } from './organizationInfo.ts';

export interface Organization {
  organizationId: string;
  organizationName: string;
  role: OrganizationRoles;
}

export interface OrganizationSchema {
  data?: Organization[];
  isLoading: boolean;
}
