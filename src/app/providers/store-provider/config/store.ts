import { configureStore, Reducer, ReducersMapObject } from "@reduxjs/toolkit";
import { StateSchema, ThunkExtraArg } from "./StateSchema.ts";
import { createReducerManager } from "./reducerManager.ts";
import { NavigateOptions, To } from "react-router-dom";
import { $api } from "@/shared/api/api.ts";

export function createReduxStore(
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>,
  navigate?: (to: To, options?: NavigateOptions) => void
)
{
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
  };

  const reducerManager = createReducerManager(rootReducers);

  const extraArg: ThunkExtraArg = {
    api: $api,
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

  // @ts-ignore
  store.reducerManager = reducerManager;

  return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>["dispatch"];
