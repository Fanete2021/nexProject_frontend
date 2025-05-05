import { OrganizationMember } from './organizationMember.ts';

export interface OrganizationInfo {
  organizationId: string;
  organizationName: string;
  organizationDescription?: string;
  members: OrganizationMember[];
}
