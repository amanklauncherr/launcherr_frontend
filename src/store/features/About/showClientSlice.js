import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { getCookie } from 'js-cookie';

const initialState = {
    clientDetails: null,
    loading: false,
    error: null,
};

export const getClientDetails = createAsyncThunk(
    'client/getClientDetails',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('authToken');
            if (!token) {
                return rejectWithValue('Token not found in cookies');
            }

            const response = await api.get('/Show-Client', {
                headers: {
                    'token': token,
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            return rejectWithValue(errorMessage);
        }
    }
);

const showClientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClientDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClientDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.clientDetails = action.payload;
            })
            .addCase(getClientDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default showClientSlice.reducer;
