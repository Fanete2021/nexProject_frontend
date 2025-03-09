import type { ReduxStoreWithManager, StateSchema, ThunkConfig } from './config/StateSchema';
import { AppDispatch, createReduxStore } from './config/store';
import { StoreProvider } from './ui/StoreProvider.tsx';

export {
    StoreProvider,
    createReduxStore,
    StateSchema,
    ReduxStoreWithManager,
    ThunkConfig
};

export type {
    AppDispatch
};
