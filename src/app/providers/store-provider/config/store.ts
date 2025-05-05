import { configureStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { StateSchema, ThunkExtraArg } from './StateSchema.ts';
import { createReducerManager } from './reducerManager.ts';
import { NavigateOptions, To } from 'react-router-dom';
import { configureApi } from '@/shared/api/api.ts';
import { userReducer } from '@/entities/user';
import { chatReducer } from '@/features/chat';
import { videoReducer } from '@/features/video';
import { authReducer } from '@/features/account/auth';
import { organizationReducer } from '@/entities/organization';

export function createReduxStore(
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>,
  navigate?: (to: To, options?: NavigateOptions) => void
) {
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    video: videoReducer,
    organization: organizationReducer,
  };

  const reducerManager = createReducerManager(rootReducers);

  const extraArg: ThunkExtraArg = {
    navigate: navigate
  };

  const store = configureStore({
    reducer: reducerManager.reduce as Reducer<StateSchema>,
    preloadedState: initialState,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg
      }
    })
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  store.reducerManager = reducerManager;

  extraArg.api = configureApi(store);

  return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
