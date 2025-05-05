import { User, UserSchema } from './model/types/user.ts';
import { userActions, userReducer } from './model/slice/userSlice.ts';
import { fetchUserData } from './model/service/fetchUserData.ts';
import { getUserData } from './model/selectors/getUserData.ts';

export type {
  User,
  UserSchema
};

export {
  userActions,
  userReducer,

  fetchUserData,

  getUserData
};
