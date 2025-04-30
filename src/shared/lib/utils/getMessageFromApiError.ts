import { ApiError } from '@/shared/types/apiError.ts';

/**
 * Получение сообщения об ошибке из ответа с сервера
 */
export const getMessageFromApiError = (error: ApiError, location: string): string | null => {
  if (!error.details || !Array.isArray(error.details)) {
    return null;
  }

  const foundError = error.details.find((detail) => detail.location === location);

  return foundError ? foundError.message : null;
};
