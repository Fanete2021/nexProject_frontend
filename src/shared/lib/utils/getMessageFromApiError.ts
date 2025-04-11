import { ApiError } from '@/shared/types/apiError.ts';

export const getMessageFromApiError = (error: ApiError, location: string): string | null => {
  if (!error.details || !Array.isArray(error.details)) {
    return null;
  }

  const foundError = error.details.find((detail) => detail.location === location);

  return foundError ? foundError.message : null;
};
