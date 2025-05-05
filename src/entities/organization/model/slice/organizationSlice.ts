import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organization, OrganizationSchema } from '../types/organization.ts';
import { createOrganization } from '../service/createOrganization.ts';
import { fetchMyOrganizations } from '../service/fetchMyOrganizations.ts';
import { fetchOrganizationInfo } from '../service/fetchOrganizationInfo.ts';
import { addMembersToOrganization } from '../service/addMembersToOrganization.ts';

const initialState: OrganizationSchema = {
  data: undefined,
  isLoading: false,
  selectedOrganization: undefined,
};

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Organization[]>) => {
      state.data = action.payload;
    },
    removeMemberFromSelectedOrganizationById: (state, action: PayloadAction<string>) => {
      if (state.selectedOrganization) {
        state.selectedOrganization.members = state.selectedOrganization.members.filter(
          member => member.userId !== action.payload
        );
      }
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
      })
      .addCase(fetchOrganizationInfo.fulfilled, (state: OrganizationSchema, action) => {
        state.selectedOrganization = action.payload;
      })
      .addCase(addMembersToOrganization.fulfilled, (state: OrganizationSchema, action) => {
        state.selectedOrganization = action.payload;
      });
  }
});

export const { actions: organizationActions } = organizationSlice;
export const { reducer: organizationReducer } = organizationSlice;
