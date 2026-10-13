// src/store/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// Editör: sadece kendisine atanan siparişler, admin: hepsi (filtre backend'de)
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ status, search, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (search) params.search = search;

      const { data } = await axios.get(`${BASE_URL}/admin/orders`, { ...authHeaders(), params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Siparişler alınamadı.');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status, note, trackingNumber, carrier }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/admin/orders/${orderId}/status`,
        { status, note, trackingNumber, carrier },
        authHeaders()
      );
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sipariş durumu güncellenemedi.');
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  filters: { status: '', search: '' },
  loading: false,
  updating: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    selectOrder: (state, action) => {
      state.selectedOrder = state.orders.find(o => o._id === action.payload) || null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrders: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updated = action.payload;

        // Backend'in döndüğü kayıtta user sadece { name } ve items.product populate edilmemiş
        // olduğu için, listedeki dolu halini bozmamak adına user ve items'ı koruyoruz.
        const merge = (old) => ({ ...old, ...updated, user: old.user, items: old.items });

        state.orders = state.orders.map(o => (o._id === updated._id ? merge(o) : o));

        if (state.selectedOrder?._id === updated._id) {
          state.selectedOrder = merge(state.selectedOrder);
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { selectOrder, clearSelectedOrder, setFilters, clearOrderError, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
