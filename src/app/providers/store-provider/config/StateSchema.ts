import { AnyAction, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { NavigateOptions, To } from 'react-router-dom';
import { UserSchema } from '@/entities/user';
import { ChatSchema } from '@/features/chat';
import { VideoSchema } from '@/features/video';
import { AuthSchema } from '@/features/account/auth';
import { OrganizationSchema } from '@/entities/organization';
import { TeamSchema } from '@/entities/team';

export interface StateSchema {
  auth: AuthSchema;
  user: UserSchema;
  chat: ChatSchema;
  video: VideoSchema;
  organization: OrganizationSchema;
  team: TeamSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (state: StateSchema, action: AnyAction) => StateSchema;
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
  api?: AxiosInstance;
  navigate?: (to: To, options?: NavigateOptions) => void;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: StateSchema;
}
