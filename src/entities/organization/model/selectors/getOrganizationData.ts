import { StateSchema } from '@/app/providers/store-provider';

export const getOrganizationData = (state: StateSchema) => state?.organization?.data;
