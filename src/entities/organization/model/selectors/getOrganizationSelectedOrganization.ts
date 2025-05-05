import { StateSchema } from '@/app/providers/store-provider';

export const getOrganizationSelectedOrganization = (state: StateSchema) => state?.organization?.selectedOrganization;
