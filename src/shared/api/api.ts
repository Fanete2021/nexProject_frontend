import axios from 'axios';
import { StateSchema } from '@/app/providers/store-provider';
import { getAuthToken } from '@/features/auth';
import { Store } from '@reduxjs/toolkit';

let store: Store<StateSchema>;

export const configureApi = (appStore: Store<StateSchema>) => {
    store = appStore; // Сохраняем store

    const api = axios.create({
        baseURL: import.meta.env.VITE_API,
        withCredentials: true,
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

export const $api = configureApi(store);
