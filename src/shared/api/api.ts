import axios from 'axios';

export const $api = axios.create({
    baseURL: import.meta.env.VITE_API,
    withCredentials: true
});

export interface apiResponse<T> {
  data: T,
  statusCode: number,
  statusTest: string
}
