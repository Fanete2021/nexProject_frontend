import axios from 'axios';
import { StateSchema } from '@/app/providers/store-provider';
import { getAuthToken } from '@/features/auth';
import { Store } from '@reduxjs/toolkit';

export const configureApi = (store: Store<StateSchema>) => {
    const api = axios.create({
        baseURL: import.meta.env.VITE_API
    });

    api.interceptors.request.use((config) => {
        const token = getAuthToken(store.getState());

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    return api;
};
