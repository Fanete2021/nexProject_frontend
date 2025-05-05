import { StateSchema } from '@/app/providers/store-provider';

export const getOrganizationIsLoading = (state: StateSchema) => state?.organization?.isLoading;
