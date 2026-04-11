import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://localhost:4000";

// FIX 1: pairingCode ve pairingLoading initialState'e eklendi
const initialState = {
  devices: [],
  loading: false,
  error: null,
  pairingStatus: null,
  pairingCode: null,
  pairingLoading: false,
  pairingError: null,
};

export const startPairingAction = createAsyncThunk(
  'device/startPairing',
  async (pairingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/api/devices/generate-pairing-code`,
        pairingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Eşleşme kodu alınamadı.");
    }
  }
);

export const completePairing = createAsyncThunk(
  'device/completePairing',
  async (pairingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/api/devices/complete-pairing`,
        pairingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cihaz eşleştirilemedi.");
    }
  }
);

export const getMyDevices = createAsyncThunk(
  'device/getMyDevices',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${BASE_URL}/api/devices/my-devices`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.devices;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cihazlar yüklenemedi.");
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/devices/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'device/deleteDevice',
  async (deviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BASE_URL}/api/devices/${deviceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return deviceId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cihaz silinemedi.");
    }
  }
);

export const assignDeviceToRoom = createAsyncThunk(
  'device/assignToRoom',
  async ({ deviceId, homeId, roomId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/api/devices/${deviceId}/assign`,
        { homeId, roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { deviceId, homeId, roomId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    clearDeviceError: (state) => {
      state.error = null;
    },
    resetPairingStatus: (state) => {
      state.pairingStatus = null;
      state.pairingCode = null;
      state.pairingLoading = false;
      state.pairingError = null;
    },
  },
  extraReducers: (builder) => {
    // startPairingAction
    builder.addCase(startPairingAction.pending, (state) => {
      state.loading = true;
      state.pairingCode = null; // önceki kodu temizle
    });
    builder.addCase(startPairingAction.fulfilled, (state, action) => {
      state.loading = false;
      state.pairingCode = action.payload.code;
    });
    builder.addCase(startPairingAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // completePairing
    builder.addCase(completePairing.pending, (state) => {
      state.pairingLoading = true;
      state.pairingError = null;
    });
    builder.addCase(completePairing.fulfilled, (state, action) => {
      state.pairingLoading = false;
      state.pairingError = null;
      state.pairingCode = null; // eşleşme bitti, kodu temizle
      // Yeni cihazı listeye ekle (eğer backend döndürüyorsa)
      if (action.payload?.device) {
        state.devices.push(action.payload.device);
      }
    });
    builder.addCase(completePairing.rejected, (state, action) => {
      state.pairingLoading = false;
      state.pairingError = action.payload;
    });
    builder.addCase(getMyDevices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMyDevices.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(getMyDevices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // updateDevice
    builder.addCase(updateDevice.fulfilled, (state, action) => {
      const index = state.devices.findIndex(d => d._id === action.payload._id);
      if (index !== -1) {
        state.devices[index] = action.payload;
      }
    });
    builder.addCase(deleteDevice.fulfilled, (state, action) => {
      state.devices = state.devices.filter(device => device._id !== action.payload);
    });
    builder.addCase(assignDeviceToRoom.fulfilled, (state, action) => {
      const { deviceId, homeId, roomId } = action.payload;
      const device = state.devices.find(d => d._id === deviceId);
      if (device) {
        device.homeId = homeId;
        device.roomId = roomId;
      }
    });
  },
});

export const { clearDeviceError, resetPairingStatus } = deviceSlice.actions;
export default deviceSlice.reducer;