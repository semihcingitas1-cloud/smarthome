import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://backend-d72l.onrender.com";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token?.trim()}`
        },
        withCredentials: true
    };
};

const initialState = {

    ramUsageData: [], 
    logs: [], 
    metricsLoading: false, 
    logsLoading: false, 
    metricsError: null, 
    logsError: null, 
};

export const getServerRamUsage = createAsyncThunk(

    'serverMetrics/getServerRamUsage',

    async ({ projectId, instanceId }, { rejectWithValue }) => {

        try {

            const { data } = await axios.get(`${BASE_URL}/admin/server/ram-usage?projectId=${projectId}&instanceId=${instanceId}`, getAuthConfig() );
            return data.data; 
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'RAM metrikleri alınamadı.' });
        }
    }
);

export const getServerLogs = createAsyncThunk(

    'serverMetrics/getServerLogs',

    async ({ projectId, instanceId }, { rejectWithValue }) => {

        try {

            const { data } = await axios.get( `${BASE_URL}/admin/server/logs?projectId=${projectId}&instanceId=${instanceId}`, getAuthConfig() );
            return data.data;
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'Sunucu logları alınamadı.' });
        }
    }
);

const serverMetricsSlice = createSlice({

    name: 'serverMetrics',
    initialState,
    reducers: {
        clearMetricsError: (state) => {

            state.metricsError = null;
        },
        clearLogsError: (state) => {

            state.logsError = null;
        },
        resetServerState: (state) => {

            state.ramUsageData = [];
            state.logs = [];
            state.metricsError = null;
            state.logsError = null;
        }
    },
    extraReducers: (builder) => {

        builder.addCase(getServerRamUsage.pending, (state) => {

            state.metricsLoading = true;
            state.metricsError = null;
        });
        builder.addCase(getServerRamUsage.fulfilled, (state, action) => {

            state.metricsLoading = false;
            state.ramUsageData = action.payload;
        });
        builder.addCase(getServerRamUsage.rejected, (state, action) => {

            state.metricsLoading = false;
            state.metricsError = action.payload?.message || 'RAM verileri yüklenirken bir hata oluştu.';
        });
        builder.addCase(getServerLogs.pending, (state) => {

            state.logsLoading = true;
            state.logsError = null;
        });
        builder.addCase(getServerLogs.fulfilled, (state, action) => {

            state.logsLoading = false;
            state.logs = action.payload;
        });
        builder.addCase(getServerLogs.rejected, (state, action) => {

            state.logsLoading = false;
            state.logsError = action.payload?.message || 'Loglar yüklenirken bir hata oluştu.';
        });
    },
});

export const { clearMetricsError, clearLogsError, resetServerState } = serverMetricsSlice.actions;
export default serverMetricsSlice.reducer;