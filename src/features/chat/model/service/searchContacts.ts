import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { Contact } from '../../model/types/contact.ts';

interface SearchContactsResponse {
    searchUsers: Contact[];
    pageCount: number;
}

export const searchContacts = createAsyncThunk<SearchContactsResponse, string, ThunkConfig<string>> (
    'chat/searchContacts',
    async (searchValue, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
        } = thunkAPI;

        try {
            const response = await extra.api.get(`/chat/search/${searchValue}`, {
                params: {
                    pageNumber: 1,
                    pageSize: 10,
                }
            });

            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);
