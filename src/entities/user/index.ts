import { User, UserSchema } from './model/types/user.ts';
import { userActions, userReducer } from './model/slice/userSlice.ts';

export type {
    User,
    UserSchema
};

export {
    userActions,
    userReducer
};
