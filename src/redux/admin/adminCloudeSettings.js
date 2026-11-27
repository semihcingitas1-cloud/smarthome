
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://ornekciceksitesi.com';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token.trim()}` }
        : {})
    },
    withCredentials: true
  };
};

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  metrics: {
    cpu: {
      usagePercent: null
    },
    ram: {
      usagePercent: null
    },
    network: {
      inboundBytesPerSecond: null,
      outboundBytesPerSecond: null
    },
    timestamp: null
  },

  logs: [],
  logsTotal: 0,
  logsCounts: null,

  metricsLoading: false,
  logsLoading: false,

  metricsError: null,
  logsError: null
};

// ======================================================
// CPU + RAM + NETWORK
// GET /admin/server
// ======================================================

export const getServerMetrics = createAsyncThunk(
  'serverMetrics/getServerMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/admin/server`,
        getAuthConfig()
      );

      if (!data.success) {
        return rejectWithValue({
          message: data.message || 'Sunucu metrikleri alınamadı.'
        });
      }

      return {
        cpu: {
          usagePercent: data.cpu?.usagePercent ?? null
        },
        ram: {
          usagePercent: data.ram?.usagePercent ?? null
        },
        network: {
          inboundBytesPerSecond:
            data.network?.inboundBytesPerSecond ?? null,
          outboundBytesPerSecond:
            data.network?.outboundBytesPerSecond ?? null
        },
        timestamp: data.timestamp ?? null
      };
    } catch (error) {
      // ✅ Frontend'de backend'den gelen hatayı yakala ve logla
      console.error('GET SERVER METRICS HATASI (frontend):', error.response?.data || error.message);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || 'Sunucu metrikleri alınamadı.'
        }
      );
    }
  }
);

// ======================================================
// SUNUCU LOGLARI
// GET /admin/server/logs → sunucudaki winston log dosyaları
// ======================================================

export const getServerLogs = createAsyncThunk(
  'serverMetrics/getServerLogs',
  async ({ level, search, page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/admin/server/logs`,
        {
          ...getAuthConfig(),
          params: {
            page,
            limit,
            ...(level ? { level } : {}),
            ...(search ? { search } : {})
          }
        }
      );

      return { data: data.data ?? [], total: data.total ?? 0, counts: data.counts ?? null };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Sunucu logları alınamadı.'
        }
      );
    }
  }
);

// ======================================================
// SLICE
// ======================================================

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
      state.metrics = {
        cpu: { usagePercent: null },
        ram: { usagePercent: null },
        network: {
          inboundBytesPerSecond: null,
          outboundBytesPerSecond: null
        },
        timestamp: null
      };

      state.logs = [];
      state.metricsError = null;
      state.logsError = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // CPU + RAM + Network
      .addCase(getServerMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.metricsError = null;
      })
      .addCase(getServerMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = action.payload;
      })
      .addCase(getServerMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.metricsError =
          action.payload?.message ||
          'Sunucu metrikleri yüklenirken bir hata oluştu.';
      })

      // Logs
      .addCase(getServerLogs.pending, (state) => {
        state.logsLoading = true;
        state.logsError = null;
      })
      .addCase(getServerLogs.fulfilled, (state, action) => {
        state.logsLoading = false;
        state.logs = action.payload.data;
        state.logsTotal = action.payload.total;
        state.logsCounts = action.payload.counts;
      })
      .addCase(getServerLogs.rejected, (state, action) => {
        state.logsLoading = false;
        state.logsError =
          action.payload?.message ||
          'Loglar yüklenirken bir hata oluştu.';
      });
  }
});

export const {
  clearMetricsError,
  clearLogsError,
  resetServerState
} = serverMetricsSlice.actions;

export default serverMetricsSlice.reducer;
