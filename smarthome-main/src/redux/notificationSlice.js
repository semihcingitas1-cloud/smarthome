import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Diğer slice'larındaki BASE_URL ile aynı olmalı
const BASE_URL = "https://ornekciceksitesi.com";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/notifications`, {
        headers: authHeaders(),
        params: { page, limit },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Bildirimler alınamadı.');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/notifications/${id}/read`, {}, {
        headers: authHeaders(),
      });
      return data.unreadCount;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await axios.patch(`${BASE_URL}/notifications/read-all`, {}, { headers: authHeaders() });
      return 0;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/notifications/${id}`, {
        headers: authHeaders(),
      });
      return data.unreadCount;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Bildirimler alınamadı.';
      })
      // İyimser güncelleme: istek bitmeden ekranda okundu görünür
      .addCase(markNotificationRead.pending, (state, action) => {
        const item = state.items.find((i) => i._id === action.meta.arg);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        if (typeof action.payload === 'number') state.unreadCount = action.payload;
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.items.forEach((n) => { n.isRead = true; });
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.pending, (state, action) => {
        const item = state.items.find((i) => i._id === action.meta.arg);
        if (item && !item.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.items = state.items.filter((i) => i._id !== action.meta.arg);
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        if (typeof action.payload === 'number') state.unreadCount = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
