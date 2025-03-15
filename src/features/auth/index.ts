import { LoginFormAsync } from './ui/login-form/LoginForm.async.tsx';
import { AuthSchema } from './model/types/authSchema.ts';
import { authReducer, authActions } from './model/slice/authSlice.ts';
import { login } from './model/service/login.ts';
import { refreshToken } from './model/service/refreshToken.ts';
import { getAuthIsAuth } from './model/selectors/getAuthIsAuth.ts';
import { getAuthToken } from './model/selectors/getAuthToken.ts';

export type {
    AuthSchema
};

export {
    LoginFormAsync as LoginForm,

    authReducer,
    authActions,

    login,
    refreshToken,

    getAuthIsAuth,
    getAuthToken
};
