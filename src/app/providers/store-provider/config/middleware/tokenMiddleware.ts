import { Middleware } from '@reduxjs/toolkit';
import { StateSchema } from '@/app/providers/store-provider';
import { getAuthToken, refreshToken } from '@/features/auth';
import { isTokenExpired } from '@/shared/lib/utils/isTokenExpired.ts'; 

export const tokenMiddleware: Middleware<object, StateSchema> = (store) => (next) => (action) => {
    const token = getAuthToken(store.getState());

    if (token && isTokenExpired(token)) {
        store.dispatch(refreshToken());
    }

    return next(action);
};
