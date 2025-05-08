import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organization, OrganizationSchema } from '../types/organization.ts';
import { createOrganization } from '../service/createOrganization.ts';
import { fetchMyOrganizations } from '../service/fetchMyOrganizations.ts';

const initialState: OrganizationSchema = {
  data: undefined,
  isLoading: false,
};

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Organization[]>) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrganization.fulfilled, (state: OrganizationSchema, action) => {
        if (!state.data) {
          state.data = [];
        }

        state.data.push(action.payload);
      })
      .addCase(fetchMyOrganizations.pending, (state: OrganizationSchema) => {
        state.isLoading = true;
      })
      .addCase(fetchMyOrganizations.fulfilled, (state: OrganizationSchema, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyOrganizations.rejected, (state: OrganizationSchema) => {
        state.isLoading = false;
      });
  }
});

export const { actions: organizationActions } = organizationSlice;
export const { reducer: organizationReducer } = organizationSlice;
