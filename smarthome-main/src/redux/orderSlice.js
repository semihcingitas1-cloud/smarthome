import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { BASE_URL, authHeaders } from '../utils/checkout';

const config = (extra = {}) => ({ headers: authHeaders(), ...extra });

const toError = (error, fallback) => ({
  message: error.response?.data?.message || fallback,
  code: error.response?.data?.code || null,
  status: error.response?.status || null,
  data: error.response?.data || null,
});

// ───────────────────────── EDİTÖR / ADMİN ─────────────────────────

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ status, search, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (search) params.search = search;

      const { data } = await axios.get(`${BASE_URL}/admin/orders`, config({ params }));
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
      const { data } = await axios.put(
        `${BASE_URL}/admin/orders/${orderId}/status`,
        { status, note, trackingNumber, carrier },
        config()
      );
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sipariş durumu güncellenemedi.');
    }
  }
);

// ───────────────────────── MÜŞTERİ ─────────────────────────

/**
 * payload: { items, shippingAddress, payment: { method, cardLast4? }, couponCode?, expectedTotal?, notes? }
 * Fiyat ve indirim sunucuda hesaplanır; expectedTotal ekranda gösterilen toplamdır.
 */
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/orders`, { ...payload, platform: 'web', source: 'web' }, config());
      return data.order;
    } catch (error) {
      return rejectWithValue(toError(error, 'Sipariş oluşturulamadı.'));
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async ({ status, page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      const { data } = await axios.get(`${BASE_URL}/orders/my-orders`, config({ params }));
      return data;
    } catch (error) {
      return rejectWithValue(toError(error, 'Siparişler alınamadı.'));
    }
  }
);

export const fetchMyOrder = createAsyncThunk(
  'orders/fetchMyOrder',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/orders/${id}`, config());
      return data.order;
    } catch (error) {
      return rejectWithValue(toError(error, 'Sipariş bulunamadı.'));
    }
  }
);

export const cancelMyOrder = createAsyncThunk(
  'orders/cancelMyOrder',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/orders/${id}/cancel`, { reason }, config());
      return data.order;
    } catch (error) {
      return rejectWithValue(toError(error, 'Sipariş iptal edilemedi.'));
    }
  }
);

export const requestOrderReturn = createAsyncThunk(
  'orders/requestOrderReturn',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/orders/${id}/return`, { reason }, config());
      return data.order;
    } catch (error) {
      return rejectWithValue(toError(error, 'İade talebi oluşturulamadı.'));
    }
  }
);

// ───────────────────────── ADRESLER ─────────────────────────

export const fetchAddresses = createAsyncThunk(
  'orders/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/addresses`, config());
      return data.addresses ?? [];
    } catch (error) {
      return rejectWithValue(toError(error, 'Adresler alınamadı.'));
    }
  }
);

export const addAddress = createAsyncThunk(
  'orders/addAddress',
  async (address, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/addresses`, address, config());
      return data.addresses ?? [];
    } catch (error) {
      return rejectWithValue(toError(error, 'Adres eklenemedi.'));
    }
  }
);

// ───────────────────────── SLICE ─────────────────────────

const initialState = {
  // editör / admin
  orders: [],
  selectedOrder: null,
  filters: { status: '', search: '' },
  loading: false,
  updating: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },

  // müşteri
  myOrders: [],
  myOrdersLoading: false,
  myOrdersError: null,
  myPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  currentOrder: null,
  placing: false,
  actionLoading: false,

  addresses: [],
  addressesLoading: false,
  addressesLoaded: false,
};

// Listedeki dolu alanları (populate edilmiş ürün, kullanıcı) bozmadan güncelle
const mergeOrder = (list, updated) => list.map((o) => (o._id === updated._id ? { ...o, ...updated, user: o.user ?? updated.user, items: o.items ?? updated.items } : o));

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
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
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
      })

      .addCase(placeOrder.pending, (state) => {
        state.placing = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placing = false;
        state.currentOrder = action.payload;
        state.myOrders = [action.payload, ...state.myOrders.filter((o) => o._id !== action.payload._id)];
      })
      .addCase(placeOrder.rejected, (state) => {
        state.placing = false;
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrders = action.payload.orders ?? [];
        state.myPagination = action.payload.pagination ?? state.myPagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersError = action.payload?.message;
      })

      .addCase(fetchMyOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.myOrders = mergeOrder(state.myOrders, action.payload);
      })

      .addCase(cancelMyOrder.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(cancelMyOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myOrders = mergeOrder(state.myOrders, action.payload);
        if (state.currentOrder?._id === action.payload._id) state.currentOrder = { ...state.currentOrder, ...action.payload };
      })
      .addCase(cancelMyOrder.rejected, (state) => {
        state.actionLoading = false;
      })

      .addCase(requestOrderReturn.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(requestOrderReturn.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myOrders = mergeOrder(state.myOrders, action.payload);
      })
      .addCase(requestOrderReturn.rejected, (state) => {
        state.actionLoading = false;
      })

      .addCase(fetchAddresses.pending, (state) => {
        state.addressesLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addressesLoading = false;
        state.addressesLoaded = true;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.addressesLoading = false;
        state.addressesLoaded = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  },
});

export const { selectOrder, clearSelectedOrder, setFilters, clearOrderError, setCurrentOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
