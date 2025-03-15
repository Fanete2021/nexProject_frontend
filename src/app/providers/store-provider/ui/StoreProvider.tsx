import {FC, useEffect, useRef} from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from '../config/store';
import { StateSchema } from '../config/StateSchema.ts';
import { ReducersMapObject } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { DeepPartial } from '@/app/types/global';

interface StoreProviderProps {
  initialState?: DeepPartial<StateSchema>,
  asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>
}

export const StoreProvider: FC<StoreProviderProps> = (props) => {
    const {
        initialState,
        children,
        asyncReducers
    } = props;

    const navigate = useNavigate();

    const store = useRef(createReduxStore(
        initialState as StateSchema,
        asyncReducers as ReducersMapObject<StateSchema>,
        navigate
    ));

    useEffect(() => {
        console.log('update')
    }, [store.current]);

    return (
        <Provider store={store.current}>
            {children}
        </Provider>
    );
};
